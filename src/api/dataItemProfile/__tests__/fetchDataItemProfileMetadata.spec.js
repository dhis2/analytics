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
        categoryOptionCombos: { coc: { categoryCombo: { id: 'comboA' } } },
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

    const fetchMetadata = (engine, items) =>
        fetchDataItemProfileMetadata(engine, items)

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
            // The disaggregation of #{deA.coc}, to tell which data sets collect it
            ['categoryOptionCombos', ['coc']],
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
            ['categoryOptionCombos', ['coc']],
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
            { known }
        )

        expect(requestsOf(engine)).toEqual([['dataElements', ['dePop']]])
        expect(Object.keys(metadata.dataElements)).toEqual(['deA', 'dePop'])
    })
})
