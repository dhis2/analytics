import { getDataItemProfile } from '../../../modules/dataItemProfile/getDataItemProfile.js'
import { fetchDataItemProfileMetadata } from '../fetchDataItemProfileMetadata.js'
import { normalizeDataItemProfileMetadata } from '../metadataQueries.js'

// The metadata responses the test tool recorded on every version
describe('fetchDataItemProfileMetadata', () => {
    const server = {
        dataElements: {
            deA: {
                aggregationType: 'SUM',
                dataSetElements: [
                    { dataSet: { id: 'dsMonthly', periodType: 'Monthly' } },
                ],
            },
            dePop: {
                aggregationType: 'AVERAGE',
                dataSetElements: [
                    { dataSet: { id: 'dsYearly', periodType: 'Yearly' } },
                ],
            },
        },
        dataSets: { dsA: { periodType: 'Weekly' } },
        indicators: {
            coverage: { numerator: '#{deA.coc}', denominator: '#{dePop}' },
            outer: {
                numerator: 'N{coverage} + R{dsA.REPORTING_RATE}',
                denominator: 'N{outer}',
            },
        },
        expressionDimensionItems: {
            edi: { expression: '#{deA} + I{pi} + D{prB.de}' },
        },
        programIndicators: {
            pi: { program: { id: 'prA' } },
            piByRegist: {
                program: { id: 'prA' },
                orgUnitField: 'REGISTRATION',
            },
        },
        programs: {
            prA: { programType: 'WITH_REGISTRATION' },
            prB: { programType: 'WITHOUT_REGISTRATION' },
        },
    }

    const createEngine = (objects = server) => ({
        query: jest.fn(async (query, { variables: { ids } }) => {
            const [resource] = Object.keys(query)

            return {
                [resource]: {
                    [resource]: ids
                        .filter((id) => objects[resource][id])
                        .map((id) => ({ id, ...objects[resource][id] })),
                },
            }
        }),
    })

    // Without the org unit level counts, which have their own test
    const fetchMetadata = (engine, items) =>
        fetchDataItemProfileMetadata(engine, items, {
            withAssignedOrgUnitCounts: false,
        })

    const requestsOf = (engine) =>
        engine.query.mock.calls.map(([query, { variables }]) => [
            Object.keys(query)[0],
            variables.ids,
        ])

    it('fetches operands round by round, each object once', async () => {
        const engine = createEngine()
        const metadata = await fetchMetadata(engine, [
            { id: 'outer', dimensionItemType: 'INDICATOR' },
            { id: 'edi', dimensionItemType: 'EXPRESSION_DIMENSION_ITEM' },
            { id: 'pi', dimensionItemType: 'PROGRAM_INDICATOR' },
        ])

        expect(requestsOf(engine)).toEqual([
            ['indicators', ['outer']],
            ['expressionDimensionItems', ['edi']],
            ['programIndicators', ['pi']],
            ['dataElements', ['deA']],
            ['indicators', ['coverage']],
            ['dataSets', ['dsA']],
            ['programs', ['prB', 'prA']],
            ['dataElements', ['dePop']],
        ])
        expect(
            getDataItemProfile(
                { id: 'outer', dimensionItemType: 'INDICATOR' },
                metadata
            )
        ).toMatchObject({
            unknown: false,
            assignedPeriodTypes: {
                types: ['Weekly', 'Monthly', 'Yearly'],
                shortestDirectType: 'Yearly',
                hasSeveral: true,
            },
        })
    })

    it('reads where a program indicator places its values', async () => {
        const metadata = await fetchMetadata(createEngine(), [
            { id: 'pi', dimensionItemType: 'PROGRAM_INDICATOR' },
            { id: 'piByRegist', dimensionItemType: 'PROGRAM_INDICATOR' },
        ])

        expect(metadata.programIndicators).toEqual({
            pi: { program: 'prA' },
            piByRegist: { program: 'prA', orgUnitField: 'REGISTRATION' },
        })
    })

    it('reads data elements, operands and reporting rates by their object', async () => {
        const engine = createEngine()

        await fetchMetadata(engine, [
            { id: 'deA', dimensionItemType: 'DATA_ELEMENT' },
            { id: 'dePop.coc', dimensionItemType: 'DATA_ELEMENT_OPERAND' },
            { id: 'dsA.REPORTING_RATE', dimensionItemType: 'REPORTING_RATE' },
        ])

        expect(requestsOf(engine)).toEqual([
            ['dataElements', ['deA', 'dePop']],
            ['dataSets', ['dsA']],
        ])
    })

    it('sends nothing without items that need metadata', async () => {
        const engine = createEngine()

        expect(await fetchMetadata(engine)).toEqual(
            normalizeDataItemProfileMetadata()
        )
        expect(engine.query).not.toHaveBeenCalled()
    })

    it('follows nested indicators until nothing new is referred to', async () => {
        const chain = Object.fromEntries(
            Array.from({ length: 20 }, (_, i) => [
                `i${i}`,
                { numerator: `N{i${i + 1}}`, denominator: '1' },
            ])
        )
        const engine = createEngine({ ...server, indicators: chain })

        await fetchMetadata(engine, [
            { id: 'i0', dimensionItemType: 'INDICATOR' },
        ])

        // i0 to i19, then i20, which isn't on the server
        expect(engine.query).toHaveBeenCalledTimes(21)
    })

    it('fetches indicators that refer to each other once', async () => {
        const engine = createEngine({
            ...server,
            indicators: {
                loopA: { numerator: 'N{loopB}', denominator: '1' },
                loopB: { numerator: 'N{loopA}', denominator: '1' },
            },
        })

        await fetchMetadata(engine, [
            { id: 'loopA', dimensionItemType: 'INDICATOR' },
        ])

        expect(requestsOf(engine)).toEqual([
            ['indicators', ['loopA']],
            ['indicators', ['loopB']],
        ])
    })

    it('fails when a request fails', async () => {
        const engine = {
            query: jest.fn().mockRejectedValue(new Error('offline')),
        }

        await expect(
            fetchDataItemProfileMetadata(engine, [
                { id: 'deA', dimensionItemType: 'DATA_ELEMENT' },
            ])
        ).rejects.toThrow('offline')
    })

    it('counts the org units each data set is assigned to per level, by default', async () => {
        const metadataEngine = createEngine()
        const engine = {
            query: jest.fn(async (query, options) => {
                if (query.levels) {
                    return {
                        levels: {
                            organisationUnitLevels: [
                                { id: 'levelTwo222', level: 2 },
                                { id: 'levelOne111', level: 1 },
                            ],
                        },
                    }
                }

                const counts = Object.entries(query).filter(([key]) =>
                    key.startsWith('query')
                )

                return counts.length
                    ? Object.fromEntries(
                          counts.map(([key, { params }]) => [
                              key,
                              {
                                  pager: {
                                      total: params.filter.includes(
                                          'level:eq:2'
                                      )
                                          ? 5
                                          : 0,
                                  },
                              },
                          ])
                      )
                    : metadataEngine.query(query, options)
            }),
        }
        const metadata = await fetchDataItemProfileMetadata(engine, [
            { id: 'dsA.REPORTING_RATE', dimensionItemType: 'REPORTING_RATE' },
        ])

        expect(metadata.assignedOrgUnitCounts).toMatchObject({ dsA: { 2: 5 } })
        expect(
            getDataItemProfile(
                {
                    id: 'dsA.REPORTING_RATE',
                    dimensionItemType: 'REPORTING_RATE',
                },
                metadata
            ).assignedOrgUnitLevels
        ).toEqual({ levels: [2], deepestLevel: 2, hasSeveral: false })
    })

    it('fetches only what the known metadata lacks', async () => {
        const engine = createEngine()
        const known = await fetchMetadata(engine, [
            { id: 'deA', dimensionItemType: 'DATA_ELEMENT' },
        ])

        engine.query.mockClear()
        const metadata = await fetchDataItemProfileMetadata(
            engine,
            [
                { id: 'deA', dimensionItemType: 'DATA_ELEMENT' },
                { id: 'dePop', dimensionItemType: 'DATA_ELEMENT' },
            ],
            { withAssignedOrgUnitCounts: false, known }
        )

        expect(requestsOf(engine)).toEqual([['dataElements', ['dePop']]])
        expect(Object.keys(metadata.dataElements)).toEqual(['deA', 'dePop'])
    })

    it('reuses known levels and assigned counts', async () => {
        const engine = createEngine()
        const metadata = await fetchDataItemProfileMetadata(
            engine,
            [{ id: 'deA', dimensionItemType: 'DATA_ELEMENT' }],
            {
                known: {
                    orgUnitLevels: [{ id: 'levelOne111', level: 1 }],
                    assignedOrgUnitCounts: { dsMonthly: { 1: 3 } },
                },
            }
        )

        expect(requestsOf(engine)).toEqual([['dataElements', ['deA']]])
        expect(metadata).toMatchObject({
            orgUnitLevels: [{ id: 'levelOne111', level: 1 }],
            assignedOrgUnitCounts: { dsMonthly: { 1: 3 } },
        })
    })
})
