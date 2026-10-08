import metadataShapes from '../../../__fixtures__/period-types/metadata-shapes.json'
import {
    dataItemProfileMetadataQueries,
    normalizeDataItemProfileMetadata,
} from '../metadataQueries.js'

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

/* Fields the test tool's requests named after a resource don't ask for, so
 * their shape on each version is unchecked: aggregationLevels has a request
 * of its own (dataElements-aggregationLevels); the others aren't recorded */
const NOT_RECORDED = [
    'aggregationLevels',
    'analyticsPeriodBoundaries[id]',
    'missingValueStrategy',
    'categoryCombo[id]',
    'dataSetElements[dataSet[id,periodType],categoryCombo[id]]',
]

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
                    dataSets: [
                        { id: 'w1', periodType: 'Weekly' },
                        { id: 'w2', periodType: 'Weekly' },
                    ],
                },
                b: {
                    aggregationType: 'SUM',
                    dataSets: [],
                },
            },
            dataSets: { ds: { periodType: undefined } },
            indicators: {},
            expressionDimensionItems: {},
            programIndicators: {},
            programs: {},
            categoryOptionCombos: {},
        })
    })

    it('keeps the category combo each data set gives an element, its own by default', () => {
        expect(
            normalizeDataItemProfileMetadata({
                dataElements: {
                    dataElements: [
                        {
                            id: 'deathsUnder5',
                            aggregationType: 'SUM',
                            categoryCombo: { id: 'defaultComb' },
                            dataSetElements: [
                                {
                                    dataSet: {
                                        id: 'mortality',
                                        periodType: 'Monthly',
                                    },
                                },
                                {
                                    dataSet: {
                                        id: 'byAgeGroup',
                                        periodType: 'Monthly',
                                    },
                                    categoryCombo: { id: 'ageGroupsCo' },
                                },
                            ],
                        },
                    ],
                },
                categoryOptionCombos: {
                    categoryOptionCombos: [
                        {
                            id: 'under1Year1',
                            categoryCombo: { id: 'ageGroupsCo' },
                        },
                    ],
                },
            })
        ).toMatchObject({
            dataElements: {
                deathsUnder5: {
                    dataSets: [
                        {
                            id: 'mortality',
                            periodType: 'Monthly',
                            categoryComboId: 'defaultComb',
                        },
                        {
                            id: 'byAgeGroup',
                            periodType: 'Monthly',
                            categoryComboId: 'ageGroupsCo',
                        },
                    ],
                },
            },
            categoryOptionCombos: {
                under1Year1: { categoryComboId: 'ageGroupsCo' },
            },
        })
    })

    it('keeps the missing value strategy of an expression dimension item', () => {
        expect(
            normalizeDataItemProfileMetadata({
                expressionDimensionItems: {
                    expressionDimensionItems: [
                        {
                            id: 'sumNeedingA',
                            expression: '#{a}+#{b}',
                            missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
                        },
                        { id: 'sumByDefaul', expression: '#{a}+#{b}' },
                    ],
                },
            }).expressionDimensionItems
        ).toEqual({
            sumNeedingA: {
                expression: '#{a}+#{b}',
                missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
            },
            sumByDefaul: { expression: '#{a}+#{b}' },
        })
    })
})
