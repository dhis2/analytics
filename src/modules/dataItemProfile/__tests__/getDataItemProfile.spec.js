import { inDataSets } from '../../../__fixtures__/dataItemProfileMetadata.js'
import { getDataItemProfile } from '../getDataItemProfile.js'
import { getPeriodAggregationType } from '../profile/collectSources.js'

const dataElement = (periodTypes, aggregationType = 'SUM') => ({
    aggregationType,
    valueType: 'INTEGER',
    domainType: 'AGGREGATE',
    dataSets: inDataSets(periodTypes),
})

const metadata = {
    dataElements: {
        monthly: dataElement(['Monthly']),
        weekly: dataElement(['Weekly']),
        mondayAndWednesday: dataElement(['Weekly', 'WeeklyWednesday']),
        weeklyAndMonthly: dataElement(['Monthly', 'Weekly']),
        population: dataElement(['Yearly'], 'AVERAGE'),
        stock: dataElement(['Monthly'], 'AVERAGE_SUM_ORG_UNIT'),
        noAggregation: dataElement(['Monthly'], 'NONE'),
        noDataSet: dataElement([]),
        oddType: dataElement(['Hourly']),
    },
    dataSets: {
        weeklyForm: { periodType: 'Weekly' },
        oddForm: { periodType: 'Hourly' },
    },
    indicators: {
        coverage: {
            numerator: '#{monthly.cocA}',
            denominator: '#{population}',
        },
        weeklyShare: { numerator: '#{weekly}', denominator: '#{monthly}' },
        nested: { numerator: 'N{coverage}', denominator: '1' },
        loopA: { numerator: 'N{loopB}', denominator: '1' },
        loopB: { numerator: 'N{loopA} + #{weekly}', denominator: '1' },
        withMissing: { numerator: '#{missing}', denominator: '1' },
        withUnknown: { numerator: 'S{sub}', denominator: '1' },
        eventsOnly: { numerator: 'I{pi} + D{pr.de}', denominator: 'C{c}' },
        reportingRate: {
            numerator: 'R{weeklyForm.REPORTING_RATE}',
            denominator: '1',
        },
        lastOverride: {
            numerator: '#{population}.aggregationType(LAST)',
            denominator: '1',
        },
        withMissingNested: { numerator: 'N{gone}', denominator: '1' },
        withMissingDataSet: {
            numerator: 'R{goneForm.REPORTING_RATE}',
            denominator: '1',
        },
    },
    programIndicators: {
        pi: { program: 'pr' },
        piByOwner: { program: 'pr', orgUnitField: 'OWNER_AT_START' },
        piByRegist: { program: 'pr', orgUnitField: 'REGISTRATION' },
    },
    programs: { pr: { programType: 'WITHOUT_REGISTRATION' } },
    expressionDimensionItems: {
        weeklyPlusMonthly: { expression: '#{weekly} + #{monthly}' },
    },
}

const profile = (id, dimensionItemType, data = metadata) =>
    getDataItemProfile({ id, dimensionItemType }, data)

describe('getDataItemProfile', () => {
    describe('data elements', () => {
        it('takes the data set type', () => {
            expect(profile('monthly', 'DATA_ELEMENT')).toEqual({
                unknown: false,
                reasons: [],
                sources: [
                    {
                        dataSet: { id: 'MonthlyForm', periodType: 'Monthly' },
                        elements: [
                            {
                                id: 'monthly',
                                aggregationType: 'SUM',
                                periodAggregationType: 'SUM',
                            },
                        ],
                        reportingRate: false,
                    },
                ],
                assignedPeriodTypes: {
                    types: ['Monthly'],
                    shortestDirectType: 'Monthly',
                    hasSeveral: false,
                },
            })
        })

        it('has one source per data set', () => {
            expect(profile('weeklyAndMonthly', 'DATA_ELEMENT').sources).toEqual(
                [
                    {
                        dataSet: { id: 'MonthlyForm', periodType: 'Monthly' },
                        elements: [
                            {
                                id: 'weeklyAndMonthly',
                                aggregationType: 'SUM',
                                periodAggregationType: 'SUM',
                            },
                        ],
                        reportingRate: false,
                    },
                    {
                        dataSet: { id: 'WeeklyForm', periodType: 'Weekly' },
                        elements: [
                            {
                                id: 'weeklyAndMonthly',
                                aggregationType: 'SUM',
                                periodAggregationType: 'SUM',
                            },
                        ],
                        reportingRate: false,
                    },
                ]
            )
        })

        it('reads an operand by its data element, and keeps it', () => {
            const operand = profile('monthly.cocA', 'DATA_ELEMENT_OPERAND')

            expect(operand.assignedPeriodTypes.shortestDirectType).toBe(
                'Monthly'
            )
            expect(operand.sources[0].elements).toEqual([
                expect.objectContaining({
                    id: 'monthly',
                    operand: 'monthly.cocA',
                }),
            ])
        })

        it('lists several types, and the shortest direct type is the longest', () => {
            expect(profile('weeklyAndMonthly', 'DATA_ELEMENT')).toMatchObject({
                assignedPeriodTypes: {
                    types: ['Weekly', 'Monthly'],
                    shortestDirectType: 'Monthly',
                    hasSeveral: true,
                },
            })
        })

        it('goes up a type when two types have the same length', () => {
            expect(profile('mondayAndWednesday', 'DATA_ELEMENT')).toMatchObject(
                {
                    assignedPeriodTypes: {
                        types: ['Weekly', 'WeeklyWednesday'],
                        shortestDirectType: 'BiWeekly',
                        hasSeveral: true,
                    },
                }
            )
        })

        it.each([
            ['population', 'AVERAGE', 'Yearly'],
            ['stock', 'AVERAGE', 'Monthly'],
        ])(
            'counts averaged data in the shortest direct type: %s',
            (id, periodAggregationType, shortestDirectType) => {
                expect(profile(id, 'DATA_ELEMENT')).toMatchObject({
                    unknown: false,
                    sources: [{ elements: [{ periodAggregationType }] }],
                    assignedPeriodTypes: { shortestDirectType },
                })
            }
        )

        it('is unknown when not aggregatable', () => {
            expect(profile('noAggregation', 'DATA_ELEMENT')).toMatchObject({
                unknown: true,
                reasons: [{ code: 'NOT_AGGREGATABLE', id: 'noAggregation' }],
            })
        })

        it('is unknown in no data set', () => {
            expect(profile('noDataSet', 'DATA_ELEMENT')).toMatchObject({
                unknown: true,
                reasons: [{ code: 'NO_DATA_SET', id: 'noDataSet' }],
                sources: [
                    {
                        dataSet: null,
                        elements: [{ id: 'noDataSet' }],
                    },
                ],
                assignedPeriodTypes: { types: [], shortestDirectType: null },
            })
        })

        it('is unknown with a period type it does not know', () => {
            expect(profile('oddType', 'DATA_ELEMENT')).toMatchObject({
                unknown: true,
                reasons: [
                    {
                        code: 'UNKNOWN_PERIOD_TYPE',
                        id: 'oddType',
                        periodType: 'Hourly',
                    },
                ],
                assignedPeriodTypes: { types: [] },
            })
        })

        it('is unknown without metadata', () => {
            expect(profile('missing', 'DATA_ELEMENT', {})).toMatchObject({
                unknown: true,
                reasons: [{ code: 'MISSING_METADATA', id: 'missing' }],
            })
        })
    })

    describe('reporting rates', () => {
        it('take the data set type', () => {
            expect(
                profile('weeklyForm.REPORTING_RATE', 'REPORTING_RATE')
            ).toMatchObject({
                sources: [
                    {
                        dataSet: { id: 'weeklyForm', periodType: 'Weekly' },
                        elements: [],
                        reportingRate: true,
                    },
                ],
                assignedPeriodTypes: {
                    types: ['Weekly'],
                    shortestDirectType: 'Weekly',
                },
            })
        })

        it('are unknown without the data set', () => {
            expect(
                profile('goneForm.ACTUAL_REPORTS', 'REPORTING_RATE')
            ).toMatchObject({ unknown: true })
        })

        it('are unknown with a period type it does not know', () => {
            expect(
                profile('oddForm.REPORTING_RATE', 'REPORTING_RATE')
            ).toMatchObject({
                unknown: true,
                assignedPeriodTypes: { types: [] },
            })
        })
    })

    describe('indicators', () => {
        it('read numerator and denominator', () => {
            // The yearly population is measured directly by year only
            expect(profile('coverage', 'INDICATOR')).toMatchObject({
                assignedPeriodTypes: {
                    types: ['Monthly', 'Yearly'],
                    shortestDirectType: 'Yearly',
                    hasSeveral: true,
                },
            })
        })

        it('group their data elements by data set, with their disaggregations', () => {
            const { sources } = getDataItemProfile(
                { id: 'sum', dimensionItemType: 'INDICATOR' },
                {
                    ...metadata,
                    indicators: {
                        sum: {
                            numerator: '#{monthly} + #{stock} + #{monthly.coc}',
                            denominator: 'R{MonthlyForm.REPORTING_RATE}',
                        },
                    },
                    dataSets: { MonthlyForm: { periodType: 'Monthly' } },
                }
            )

            expect(sources).toEqual([
                {
                    dataSet: { id: 'MonthlyForm', periodType: 'Monthly' },
                    elements: [
                        {
                            id: 'monthly',
                            aggregationType: 'SUM',
                            periodAggregationType: 'SUM',
                        },
                        {
                            id: 'stock',
                            aggregationType: 'AVERAGE_SUM_ORG_UNIT',
                            periodAggregationType: 'AVERAGE',
                        },
                        {
                            id: 'monthly',
                            operand: 'monthly.coc',
                            aggregationType: 'SUM',
                            periodAggregationType: 'SUM',
                        },
                    ],
                    reportingRate: true,
                },
            ])
        })

        it('mix the types of their data elements', () => {
            expect(profile('weeklyShare', 'INDICATOR')).toMatchObject({
                assignedPeriodTypes: {
                    shortestDirectType: 'Monthly',
                    hasSeveral: true,
                },
            })
        })

        it('read nested indicators', () => {
            expect(
                profile('nested', 'INDICATOR').assignedPeriodTypes
                    .shortestDirectType
            ).toBe('Yearly')
        })

        it('read indicators that refer to each other once', () => {
            expect(profile('loopA', 'INDICATOR')).toMatchObject({
                unknown: false,
                assignedPeriodTypes: { shortestDirectType: 'Weekly' },
            })
        })

        it('take an aggregation type set in the expression', () => {
            expect(profile('lastOverride', 'INDICATOR')).toMatchObject({
                sources: [
                    {
                        elements: [
                            {
                                aggregationType: 'LAST',
                                periodAggregationType: 'LAST',
                            },
                        ],
                    },
                ],
                assignedPeriodTypes: { shortestDirectType: 'Yearly' },
            })
        })

        it('take a reporting rate operand', () => {
            expect(
                profile('reportingRate', 'INDICATOR').assignedPeriodTypes
                    .shortestDirectType
            ).toBe('Weekly')
        })

        it('are not limited by event data, constants or days', () => {
            expect(profile('eventsOnly', 'INDICATOR')).toMatchObject({
                unknown: false,
                assignedPeriodTypes: { types: [], shortestDirectType: null },
            })
        })

        it('read the programs of their event data', () => {
            expect(profile('eventsOnly', 'INDICATOR').sources).toEqual([
                {
                    dataSet: null,
                    program: { id: 'pr' },
                    elements: [],
                    reportingRate: false,
                },
            ])
        })

        it.each([
            ['withMissing', 'MISSING_METADATA'],
            ['withMissingNested', 'MISSING_METADATA'],
            ['withMissingDataSet', 'MISSING_METADATA'],
            ['withUnknown', 'UNKNOWN_OPERAND'],
            ['gone', 'MISSING_METADATA'],
        ])('%s is unknown: %s', (id, code) => {
            expect(profile(id, 'INDICATOR')).toMatchObject({
                unknown: true,
                reasons: [expect.objectContaining({ code })],
            })
        })
    })

    describe('expression dimension items', () => {
        it('read their expression', () => {
            expect(
                profile('weeklyPlusMonthly', 'EXPRESSION_DIMENSION_ITEM')
            ).toMatchObject({
                assignedPeriodTypes: {
                    shortestDirectType: 'Monthly',
                    hasSeveral: true,
                },
            })
        })

        it('are unknown without metadata', () => {
            expect(profile('gone', 'EXPRESSION_DIMENSION_ITEM').unknown).toBe(
                true
            )
        })
    })

    describe('event and tracker items', () => {
        it.each([
            ['pi', 'PROGRAM_INDICATOR'],
            ['pr.de', 'PROGRAM_DATA_ELEMENT'],
            ['pr.de.option', 'PROGRAM_DATA_ELEMENT_OPTION'],
            ['pr.at', 'PROGRAM_ATTRIBUTE'],
            ['pr.de', 'EVENT_DATA_ITEM'],
        ])(
            '%s (%s) has its program as source, and no period type',
            (id, type) => {
                expect(profile(id, type)).toMatchObject({
                    unknown: false,
                    sources: [{ program: { id: 'pr' } }],
                    assignedPeriodTypes: {
                        types: [],
                        shortestDirectType: null,
                    },
                })
            }
        )

        it('keeps a program indicator placed by registration or an attribute apart from its program', () => {
            expect(profile('piByRegist', 'PROGRAM_INDICATOR').sources).toEqual([
                {
                    dataSet: null,
                    program: { id: 'pr' },
                    orgUnitField: 'REGISTRATION',
                    elements: [],
                    reportingRate: false,
                },
            ])
            expect(profile('piByOwner', 'PROGRAM_INDICATOR').sources).toEqual([
                {
                    dataSet: null,
                    program: { id: 'pr' },
                    elements: [],
                    reportingRate: false,
                },
            ])
        })

        it('is unknown without a program in its id', () => {
            expect(profile('de', 'EVENT_DATA_ITEM')).toMatchObject({
                unknown: true,
                reasons: [{ code: 'MISSING_PROGRAM', id: 'de' }],
                sources: [],
            })
        })

        it('is unknown without the metadata of its program indicator or program', () => {
            expect(profile('gone', 'PROGRAM_INDICATOR')).toMatchObject({
                unknown: true,
                reasons: [{ code: 'MISSING_METADATA', id: 'gone' }],
            })
            expect(profile('nope.de', 'PROGRAM_DATA_ELEMENT')).toMatchObject({
                unknown: true,
                reasons: [{ code: 'MISSING_METADATA', id: 'nope' }],
            })
        })
    })

    it('is unknown for an item type it does not read', () => {
        expect(profile('any', 'ORGANISATION_UNIT')).toMatchObject({
            unknown: true,
            reasons: [
                {
                    code: 'UNSUPPORTED_ITEM_TYPE',
                    id: 'any',
                    dimensionItemType: 'ORGANISATION_UNIT',
                },
            ],
        })
        expect(getDataItemProfile({ id: 'any' }).unknown).toBe(true)
    })
})

describe('getPeriodAggregationType', () => {
    it.each([
        ['SUM', 'SUM'],
        ['AVERAGE', 'AVERAGE'],
        ['AVERAGE_SUM_ORG_UNIT', 'AVERAGE'],
        ['LAST', 'LAST'],
        ['LAST_AVERAGE_ORG_UNIT', 'LAST'],
        ['LAST_LAST_ORG_UNIT', 'LAST'],
        ['LAST_IN_PERIOD_AVERAGE_ORG_UNIT', 'LAST_IN_PERIOD'],
        ['FIRST_AVERAGE_ORG_UNIT', 'FIRST'],
        ['FIRST_FIRST_ORG_UNIT', 'FIRST'],
        ['MAX_SUM_ORG_UNIT', 'MAX'],
        ['MIN_SUM_ORG_UNIT', 'MIN'],
        [undefined, undefined],
    ])('%s aggregates over time as %s', (aggregationType, expected) => {
        expect(getPeriodAggregationType(aggregationType)).toBe(expected)
    })
})
