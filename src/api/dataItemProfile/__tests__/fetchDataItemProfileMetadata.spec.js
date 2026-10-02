import metadataShapes from '../../../__fixtures__/period-types/metadata-shapes.json'
import { getDataItemProfile } from '../../../modules/dataItemProfile/getDataItemProfile.js'
import { fetchDataItemProfileMetadata } from '../fetchDataItemProfileMetadata.js'
import {
    dataItemProfileMetadataQueries,
    normalizeDataItemProfileMetadata,
} from '../metadataQueries.js'

// The metadata responses the test tool recorded on every version
const getResponses = ({ requests }) =>
    Object.fromEntries(requests.map(({ name, response }) => [name, response]))

const getRecordedFields = ({ path }) =>
    new URLSearchParams(path.split('?')[1]).get('fields')

// The top-level fields of a field list: `a,b[c,d]` gives a and b[c,d]
const splitFields = (fields) => {
    const result = []
    let depth = 0
    let current = ''

    for (const character of fields) {
        if (character === ',' && depth === 0) {
            result.push(current)
            current = ''
        } else {
            depth += { '[': 1, ']': -1 }[character] ?? 0
            current += character
        }
    }

    return [...result, current]
}

/* Fields the test tool's export doesn't record yet: their shape on each
 * version is unchecked until it does */
/* Fields the test tool's requests named after a resource don't ask for:
 * aggregationLevels has a request of its own (dataElements-aggregationLevels) */
const NOT_RECORDED = ['aggregationLevels', 'analyticsPeriodBoundaries[id]']

describe('normalizeDataItemProfileMetadata', () => {
    describe.each(Object.entries(metadataShapes.versions))(
        'the responses of %s',
        (_, shapes) => {
            const responses = getResponses(shapes)
            const metadata = normalizeDataItemProfileMetadata(responses)
            const idOfCode = (code) =>
                responses.dataElements.dataElements.find(
                    (dataElement) => dataElement.code === code
                ).id

            it('give each data element its aggregation type and data sets', () => {
                Object.values(metadata.dataElements).forEach((dataElement) => {
                    expect(typeof dataElement.aggregationType).toBe('string')
                    dataElement.dataSets.forEach((dataSet) => {
                        expect(typeof dataSet.id).toBe('string')
                        expect(typeof dataSet.periodType).toBe('string')
                    })
                })
            })

            it('keep one data set per period type, and none for an element in no data set', () => {
                expect(
                    metadata.dataElements[idOfCode('PTT_G3_MW')].dataSets
                        .map(({ periodType }) => periodType)
                        .sort()
                ).toEqual(['Weekly', 'WeeklyWednesday'])
                expect(
                    metadata.dataElements[idOfCode('PTT_G3_ORPHAN')].dataSets
                ).toEqual([])
            })

            it('give each indicator its expressions', () => {
                Object.values(metadata.indicators).forEach((indicator) => {
                    expect(typeof indicator.numerator).toBe('string')
                    expect(typeof indicator.denominator).toBe('string')
                })
            })

            it('give each data set its period type', () => {
                Object.values(metadata.dataSets).forEach((dataSet) => {
                    expect(typeof dataSet.periodType).toBe('string')
                })
            })

            it('give each expression dimension item its expression', () => {
                Object.values(metadata.expressionDimensionItems).forEach(
                    (item) => expect(typeof item.expression).toBe('string')
                )
            })

            it('were recorded with every field the library asks for', () => {
                shapes.requests
                    .filter(({ name }) => dataItemProfileMetadataQueries[name])
                    .forEach((request) => {
                        const recorded = splitFields(getRecordedFields(request))
                        const asked = splitFields(
                            dataItemProfileMetadataQueries[request.name].params(
                                {
                                    ids: [],
                                }
                            ).fields
                        ).filter((field) => !NOT_RECORDED.includes(field))

                        expect(recorded).toEqual(expect.arrayContaining(asked))
                    })
            })
        }
    )

    it('tells whether a program indicator has period boundaries', () => {
        const { programIndicators } = normalizeDataItemProfileMetadata({
            programIndicators: [
                { id: 'bounded', analyticsPeriodBoundaries: [{ id: 'start' }] },
                { id: 'unbounded', analyticsPeriodBoundaries: [] },
                { id: 'notAsked' },
            ],
        })

        expect(programIndicators.bounded.hasPeriodBoundaries).toBe(true)
        expect(programIndicators.unbounded.hasPeriodBoundaries).toBe(false)
        expect(programIndicators.notAsked).not.toHaveProperty(
            'hasPeriodBoundaries'
        )
    })

    it('keeps the aggregation levels of a data element that has some', () => {
        const { dataElements } = normalizeDataItemProfileMetadata({
            dataElements: [
                { id: 'capped', aggregationLevels: [2] },
                { id: 'free', aggregationLevels: [] },
            ],
        })

        expect(dataElements.capped.aggregationLevels).toEqual([2])
        expect(dataElements.free).not.toHaveProperty('aggregationLevels')
    })

    it('accepts lists, period types as objects and missing fields', () => {
        expect(
            normalizeDataItemProfileMetadata({
                dataElements: [
                    {
                        id: 'a',
                        aggregationType: 'SUM',
                        dataSetElements: [
                            {
                                dataSet: {
                                    id: 'w1',
                                    periodType: { name: 'Weekly' },
                                },
                            },
                            { dataSet: { id: 'w1', periodType: 'Weekly' } },
                            { dataSet: { id: 'w2', periodType: 'Weekly' } },
                            { dataSet: {} },
                            {},
                        ],
                    },
                    { id: 'b', aggregationType: 'SUM' },
                ],
                dataSets: { gist: true, dataSets: [{ id: 'ds' }] },
            })
        ).toEqual({
            dataElements: {
                a: {
                    aggregationType: 'SUM',
                    valueType: undefined,
                    domainType: undefined,
                    dataSets: [
                        { id: 'w1', periodType: 'Weekly' },
                        { id: 'w2', periodType: 'Weekly' },
                    ],
                },
                b: {
                    aggregationType: 'SUM',
                    valueType: undefined,
                    domainType: undefined,
                    dataSets: [],
                },
            },
            dataSets: { ds: { periodType: undefined } },
            indicators: {},
            expressionDimensionItems: {},
            programIndicators: {},
            programs: {},
        })
    })
})

describe('fetchDataItemProfileMetadata', () => {
    const server = {
        dataElements: {
            deA: {
                aggregationType: 'SUM',
                dataSetElements: [{ dataSet: { periodType: 'Monthly' } }],
            },
            dePop: {
                aggregationType: 'AVERAGE',
                dataSetElements: [{ dataSet: { periodType: 'Yearly' } }],
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

    it('counts the units each data set is assigned to per level, by default', async () => {
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
                    key.startsWith('count')
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

        expect(metadata.orgUnitLevels.map(({ level }) => level)).toEqual([1, 2])
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
})
