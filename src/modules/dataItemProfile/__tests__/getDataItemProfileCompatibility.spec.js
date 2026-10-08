import { inDataSets } from '../../../__fixtures__/dataItemProfileMetadata.js'
import {
    ORG_UNIT_COVERAGE,
    orgUnitProfileOf,
} from '../../../__fixtures__/dataItemProfileOrgUnits.js'
import { getDataItemProfile } from '../getDataItemProfile.js'
import { getDataItemProfileCompatibility } from '../getDataItemProfileCompatibility.js'

const dataElement = (periodTypes, aggregationType = 'SUM') => ({
    aggregationType,
    dataSets: inDataSets(periodTypes),
})

const metadata = {
    dataElements: {
        monthly: dataElement(['Monthly']),
        weekly: dataElement(['Weekly']),
        wednesday: dataElement(['WeeklyWednesday']),
        yearly: dataElement(['Yearly']),
        financialOct: dataElement(['FinancialOct']),
        population: dataElement(['Yearly'], 'AVERAGE'),
        stock: dataElement(['Monthly'], 'LAST'),
        firstMonthly: dataElement(['Monthly'], 'FIRST'),
        firstDaily: dataElement(['Daily'], 'FIRST'),
        lastFinancialApril: dataElement(['FinancialApril'], 'LAST'),
        lastYearly: dataElement(['Yearly'], 'LAST'),
        lastTwoYearly: dataElement(['TwoYearly'], 'LAST'),
        twoYearly: dataElement(['TwoYearly']),
        mondayWednesday: dataElement(['Weekly', 'WeeklyWednesday']),
    },
    indicators: {
        coverage: { numerator: '#{monthly}', denominator: '#{population}' },
        share: { numerator: '#{weekly}', denominator: '#{monthly}' },
        stockPerHead: { numerator: '#{stock}', denominator: '#{population}' },
        weeklyShareOfMonthly: {
            numerator: '#{mondayWednesday}',
            denominator: '#{weekly}',
        },
        timesTwelve: { numerator: '#{monthly} * 12', denominator: '1' },
        // A missing item of a side counts as 0
        monthlyPlusYearly: {
            numerator: '#{monthly} + #{yearly}',
            denominator: '1',
        },
        weeklyPlusWeekly: {
            numerator: '#{weekly} + #{wednesday}',
            denominator: '1',
        },
        sumOverRatio: {
            numerator: 'N{monthlyPlusYearly}',
            denominator: '#{yearly}',
        },
    },
    expressionDimensionItems: {
        sumByDefault: { expression: '#{monthly} + #{yearly}' },
        sumNeedingAll: {
            expression: '#{monthly} + #{yearly}',
            missingValueStrategy: 'SKIP_IF_ANY_VALUE_MISSING',
        },
        sumNeverSkipped: {
            expression: '#{monthly} + #{yearly}',
            missingValueStrategy: 'NEVER_SKIP',
        },
    },
}

const indicator = (id) => ({ id, dimensionItemType: 'INDICATOR' })

// A data element id, or an item
const profileOf = (item) =>
    getDataItemProfile(
        typeof item === 'string'
            ? { id: item, dimensionItemType: 'DATA_ELEMENT' }
            : item,
        metadata
    )

const compatibilityOf = (item, periods, options) =>
    getDataItemProfileCompatibility(profileOf(item), { periods }, options)

// The overall status and reasons
const outcomeOf = (...args) => {
    const { status, reasons } = compatibilityOf(...args)

    return { status, reasons }
}

const full = (reasons = []) => ({ status: 'full', reasons })
const partial = (reasons) => ({ status: 'partial', reasons })
const none = (reasons) => ({ status: 'none', reasons })
const unknown = (reasons) => ({ status: 'unknown', reasons })

describe('getDataItemProfileCompatibility', () => {
    it('gives results per period, per source and overall, which add up', () => {
        expect(compatibilityOf('monthly', ['2025W2', '202501'])).toEqual({
            status: 'partial',
            reasons: ['PERIOD_TOO_SHORT'],
            sources: [
                {
                    sourceId: 'MonthlyForm',
                    status: 'partial',
                    reasons: ['PERIOD_TOO_SHORT'],
                },
            ],
            periods: [
                {
                    id: '2025W2',
                    periodTypes: ['Weekly'],
                    status: 'none',
                    reasons: ['PERIOD_TOO_SHORT'],
                    alignsWithData: null,
                    sources: [
                        {
                            sourceId: 'MonthlyForm',
                            status: 'none',
                            reasons: ['PERIOD_TOO_SHORT'],
                        },
                    ],
                },
                {
                    id: '202501',
                    periodTypes: ['Monthly'],
                    status: 'full',
                    reasons: [],
                    alignsWithData: true,
                    sources: [
                        {
                            sourceId: 'MonthlyForm',
                            status: 'full',
                            reasons: [],
                        },
                    ],
                },
            ],
        })
    })

    it('has no status without periods', () => {
        expect(getDataItemProfileCompatibility(profileOf('monthly'))).toEqual({
            status: null,
            reasons: [],
            sources: [{ sourceId: 'MonthlyForm', status: null, reasons: [] }],
            periods: [],
        })
    })

    it('takes period types', () => {
        expect(outcomeOf('monthly', ['Quarterly'])).toEqual(full())
        expect(outcomeOf('monthly', ['Daily'])).toEqual(
            none(['PERIOD_TOO_SHORT'])
        )
    })

    it('gives nothing for another type of the same length', () => {
        expect(outcomeOf('wednesday', ['2025W2'])).toEqual(
            none(['PERIOD_TYPE_MISMATCH'])
        )
        expect(outcomeOf('yearly', ['2025April'])).toEqual(
            none(['PERIOD_TYPE_MISMATCH'])
        )
    })

    describe('values not measured for the period', () => {
        it('are averaged for averaged data in shorter periods', () => {
            expect(outcomeOf('population', ['202501'])).toEqual(
                full(['REPEATED_VALUE'])
            )
            expect(outcomeOf('population', ['2025'])).toEqual(full())
        })

        describe('FIRST and LAST', () => {
            it('LAST takes the latest data period of the years touched', () => {
                // June's value, for a day in July
                expect(outcomeOf('stock', ['20250715'])).toEqual(
                    full(['EARLIER_PERIOD_VALUE'])
                )
                // December 2024 is outside the years 1 January 2025 touches
                expect(outcomeOf('stock', ['20250101'])).toEqual(
                    none(['NO_EARLIER_PERIOD_VALUE'])
                )
                expect(outcomeOf('stock', ['2025WedW1'])).toEqual(
                    none(['NO_EARLIER_PERIOD_VALUE'])
                )
            })

            it('LAST is measured for the period when its data adds up into it', () => {
                expect(outcomeOf('stock', ['2025Q3'])).toEqual(full())
                expect(outcomeOf('stock', ['2025'])).toEqual(full())
            })

            it('FIRST takes the earliest data period of the years touched', () => {
                // January's value, for July and for the third quarter
                expect(outcomeOf('firstMonthly', ['202507'])).toEqual(
                    full(['EARLIER_PERIOD_VALUE'])
                )
                expect(outcomeOf('firstMonthly', ['2025Q3'])).toEqual(
                    full(['EARLIER_PERIOD_VALUE'])
                )
                expect(outcomeOf('firstMonthly', ['2025'])).toEqual(full())
                expect(outcomeOf('firstMonthly', ['20250101'])).toEqual(
                    none(['NO_EARLIER_PERIOD_VALUE'])
                )
                // 1 January's value, not the day's own
                expect(outcomeOf('firstDaily', ['20250715'])).toEqual(
                    full(['EARLIER_PERIOD_VALUE'])
                )
                expect(outcomeOf('firstDaily', ['20250101'])).toEqual(full())
                expect(outcomeOf('firstDaily', ['2025WedW1'])).toEqual(full())
            })

            it('read every period of the selection as one request', () => {
                // With 2024 in the request, December 2024 counts on 1 January
                const withYear = compatibilityOf('stock', ['20250101', '2024'])

                expect(withYear.periods[0]).toMatchObject(
                    full(['EARLIER_PERIOD_VALUE'])
                )
            })

            it('read the year in a data period id', () => {
                // 2024April (April 2024 to March 2025) is a 2024 period
                expect(outcomeOf('lastFinancialApril', ['20250715'])).toEqual(
                    none(['NO_EARLIER_PERIOD_VALUE'])
                )
                // …but it counts when the request touches 2024
                expect(
                    compatibilityOf('lastFinancialApril', ['20250715', '2024'])
                        .periods[0]
                ).toMatchObject(full(['EARLIER_PERIOD_VALUE']))
            })

            it('judges a period type by type alone, as it has no dates', () => {
                expect(outcomeOf('stock', ['Weekly'])).toEqual(
                    full(['EARLIER_PERIOD_VALUE'])
                )
                expect(outcomeOf('stock', ['Quarterly'])).toEqual(full())
            })

            describe('with relative periods, resolved on relativePeriodDate', () => {
                const ON_15_JUNE_2025 = { relativePeriodDate: '2025-06-15' }

                it('judges each fixed period they cover', () => {
                    // June 2024 to May 2025: each month has its own value
                    expect(
                        outcomeOf('stock', ['LAST_12_MONTHS'], ON_15_JUNE_2025)
                    ).toEqual(full())
                    // FIRST gives January 2024's value to every month
                    expect(
                        outcomeOf(
                            'firstMonthly',
                            ['LAST_12_MONTHS'],
                            ON_15_JUNE_2025
                        )
                    ).toEqual(full(['EARLIER_PERIOD_VALUE']))
                })

                it('count the years they touch for the fixed periods beside them', () => {
                    expect(
                        compatibilityOf('stock', ['20250101']).periods[0]
                    ).toMatchObject(none(['NO_EARLIER_PERIOD_VALUE']))
                    // LAST_12_MONTHS adds 2024: December 2024 counts
                    expect(
                        compatibilityOf(
                            'stock',
                            ['20250101', 'LAST_12_MONTHS'],
                            ON_15_JUNE_2025
                        ).periods[0]
                    ).toMatchObject(full(['EARLIER_PERIOD_VALUE']))
                })

                it('is partial when only some of their fixed periods have a value', () => {
                    /* The months of 2025 touch only 2025: the 2025 value ends in
                     * December, and 2024's year isn't in the request */
                    expect(
                        outcomeOf(
                            'lastYearly',
                            ['MONTHS_THIS_YEAR'],
                            ON_15_JUNE_2025
                        )
                    ).toEqual({
                        status: 'partial',
                        reasons: [
                            'NO_EARLIER_PERIOD_VALUE',
                            'EARLIER_PERIOD_VALUE',
                        ],
                    })
                })
            })

            it('may take an earlier value when the data type has no dates', () => {
                expect(outcomeOf('lastTwoYearly', ['2025'])).toEqual(
                    full(['EARLIER_PERIOD_VALUE'])
                )
            })
        })

        it('show in each source', () => {
            expect(compatibilityOf('stock', ['20250715']).sources).toEqual([
                {
                    sourceId: 'MonthlyForm',
                    status: 'full',
                    reasons: ['EARLIER_PERIOD_VALUE'],
                },
            ])
        })
    })

    describe('expressions', () => {
        it('are complete with an averaged denominator, which they report', () => {
            expect(outcomeOf(indicator('coverage'), ['202501'])).toEqual(
                full(['REPEATED_VALUE'])
            )
            expect(outcomeOf(indicator('coverage'), ['2025'])).toEqual(full())
        })

        it('are empty when one operand gives nothing, and say so', () => {
            expect(outcomeOf(indicator('coverage'), ['2025W2'])).toEqual(
                none(['OPERAND_EMPTY', 'PERIOD_TOO_SHORT', 'REPEATED_VALUE'])
            )
            expect(outcomeOf(indicator('share'), ['2025W2'])).toEqual(
                none(['OPERAND_EMPTY', 'PERIOD_TOO_SHORT'])
            )
        })

        it('are partial from a partial operand, and say so', () => {
            expect(
                outcomeOf(indicator('weeklyShareOfMonthly'), ['2025W2'])
            ).toEqual({
                status: 'partial',
                reasons: ['OPERAND_PARTIAL', 'PERIOD_TYPE_MISMATCH'],
            })
        })

        it('are partial when some items of a side give nothing, which count as 0', () => {
            expect(
                outcomeOf(indicator('monthlyPlusYearly'), ['202501'])
            ).toEqual(partial(['OPERAND_EMPTY', 'PERIOD_TOO_SHORT']))
            expect(outcomeOf(indicator('monthlyPlusYearly'), ['2025'])).toEqual(
                full()
            )
        })

        it('are empty when all items of a side give nothing', () => {
            expect(
                outcomeOf(indicator('weeklyPlusWeekly'), ['20250115'])
            ).toEqual(none(['OPERAND_EMPTY', 'PERIOD_TOO_SHORT']))
        })

        it('need both sides of a nested indicator', () => {
            expect(outcomeOf(indicator('sumOverRatio'), ['202501'])).toEqual(
                none(['OPERAND_EMPTY', 'PERIOD_TOO_SHORT'])
            )
        })

        it('add up the operands of an expression dimension item, whatever its strategy', () => {
            const expressionItem = (id) => ({
                id,
                dimensionItemType: 'EXPRESSION_DIMENSION_ITEM',
            })

            expect(
                outcomeOf(expressionItem('sumByDefault'), ['202501'])
            ).toEqual(partial(['OPERAND_EMPTY', 'PERIOD_TOO_SHORT']))
            expect(
                outcomeOf(expressionItem('sumNeverSkipped'), ['202501'])
            ).toEqual(partial(['OPERAND_EMPTY', 'PERIOD_TOO_SHORT']))
            // Analytics ignores SKIP_IF_ANY_VALUE_MISSING: a value comes back
            expect(
                outcomeOf(expressionItem('sumNeedingAll'), ['202501'])
            ).toEqual(partial(['OPERAND_EMPTY', 'PERIOD_TOO_SHORT']))
        })

        it('say nothing more with one operand', () => {
            expect(outcomeOf(indicator('timesTwelve'), ['2025W2'])).toEqual(
                none(['PERIOD_TOO_SHORT'])
            )
        })

        it('report every kind of indirect value', () => {
            expect(outcomeOf(indicator('stockPerHead'), ['20250715'])).toEqual(
                full(['REPEATED_VALUE', 'EARLIER_PERIOD_VALUE'])
            )
        })
    })

    describe('an element in several data sets', () => {
        const malaria = (aggregationType) =>
            getDataItemProfile(
                { id: 'malaria', dimensionItemType: 'DATA_ELEMENT' },
                {
                    dataElements: {
                        malaria: {
                            aggregationType,
                            dataSets: [
                                { id: 'surveillance', periodType: 'Weekly' },
                                { id: 'report', periodType: 'Monthly' },
                            ],
                        },
                    },
                }
            )

        it('is partial when some data sets give nothing', () => {
            expect(
                getDataItemProfileCompatibility(malaria('SUM'), {
                    periods: ['2025W2', '202501'],
                })
            ).toMatchObject({
                status: 'partial',
                reasons: ['PERIOD_TOO_SHORT'],
                sources: [
                    { sourceId: 'surveillance', status: 'full' },
                    { sourceId: 'report', status: 'partial' },
                ],
                periods: [
                    {
                        status: 'partial',
                        reasons: ['PERIOD_TOO_SHORT'],
                        sources: [
                            {
                                sourceId: 'surveillance',
                                status: 'full',
                                reasons: [],
                            },
                            {
                                sourceId: 'report',
                                status: 'none',
                                reasons: ['PERIOD_TOO_SHORT'],
                            },
                        ],
                    },
                    full(),
                ],
            })
        })

        it('is complete when the others give averaged values', () => {
            expect(
                getDataItemProfileCompatibility(malaria('AVERAGE'), {
                    periods: ['2025W2'],
                })
            ).toMatchObject(full(['REPEATED_VALUE']))
        })

        it('is empty when every data set gives nothing', () => {
            expect(
                getDataItemProfileCompatibility(malaria('SUM'), {
                    periods: ['20250115'],
                })
            ).toMatchObject(none(['PERIOD_TOO_SHORT']))
        })
    })

    it('reads a reporting rate in a shorter period as empty', () => {
        const profile = getDataItemProfile(
            { id: 'form.REPORTING_RATE', dimensionItemType: 'REPORTING_RATE' },
            { dataSets: { form: { periodType: 'Monthly' } } }
        )

        expect(
            getDataItemProfileCompatibility(profile, { periods: ['2025W2'] })
        ).toMatchObject({
            ...none(['REPORTING_RATE_TOO_SHORT']),
            sources: [
                { sourceId: 'form', ...none(['REPORTING_RATE_TOO_SHORT']) },
            ],
        })
        expect(
            getDataItemProfileCompatibility(profile, { periods: ['2025Q1'] })
        ).toMatchObject(full())
    })

    describe('a program indicator without period boundaries', () => {
        const profile = getDataItemProfile(
            { id: 'pi', dimensionItemType: 'PROGRAM_INDICATOR' },
            {
                programIndicators: {
                    pi: { program: 'pr', hasPeriodBoundaries: false },
                },
                programs: { pr: {} },
            }
        )
        const judge = (serverVersion) =>
            getDataItemProfileCompatibility(
                profile,
                { periods: ['2025Q1'] },
                { serverVersion }
            )

        it('is unknown before 2.43, which can’t query it', () => {
            expect(judge({ major: 2, minor: 42 })).toMatchObject({
                status: 'unknown',
                reasons: ['UNSUPPORTED_VERSION'],
            })
        })

        it('is full from 2.43, or without a server version', () => {
            expect(judge({ major: 2, minor: 43 })).toMatchObject(full())
            expect(judge()).toMatchObject(full())
        })
    })

    it('is full for event data, placed by its own dates', () => {
        const profile = getDataItemProfile(
            { id: 'pi', dimensionItemType: 'PROGRAM_INDICATOR' },
            {
                programIndicators: { pi: { program: 'pr' } },
                programs: { pr: {} },
            }
        )

        expect(
            getDataItemProfileCompatibility(profile, { periods: ['20250115'] })
        ).toMatchObject({
            ...full(),
            sources: [{ sourceId: 'pr', status: 'full', reasons: [] }],
        })
    })

    describe('unknown', () => {
        it('when the profile is, for the item and each source', () => {
            const profile = getDataItemProfile(
                { id: 'odd', dimensionItemType: 'DATA_ELEMENT' },
                {
                    dataElements: {
                        odd: {
                            aggregationType: 'SUM',
                            dataSets: [{ id: 'hourly', periodType: 'Hourly' }],
                        },
                    },
                }
            )

            expect(
                getDataItemProfileCompatibility(profile, {
                    periods: ['202501'],
                })
            ).toMatchObject({
                ...unknown(['PROFILE_UNKNOWN']),
                sources: [
                    { sourceId: 'hourly', ...unknown(['PROFILE_UNKNOWN']) },
                ],
            })
            expect(outcomeOf('missing', ['202501'])).toEqual(
                unknown(['PROFILE_UNKNOWN'])
            )
        })

        it('for a period it cannot read', () => {
            expect(compatibilityOf('monthly', ['NEXT_CENTURY'])).toMatchObject({
                ...unknown(['UNKNOWN_PERIOD']),
                periods: [{ periodTypes: [], alignsWithData: null }],
            })
        })

        it('for QuarterlyNov before 2.41', () => {
            const on = (minor) => ({ serverVersion: { major: 2, minor } })

            expect(outcomeOf('monthly', ['2025NovQ1'], on(40))).toEqual(
                unknown(['UNSUPPORTED_VERSION'])
            )
            expect(outcomeOf('monthly', ['2025NovQ1'], on(41))).toEqual(full())
            expect(outcomeOf('monthly', ['2025NovQ1'])).toEqual(full())
            expect(outcomeOf('monthly', ['2025Q1'], on(40))).toEqual(full())
        })
    })

    it('adds up periods: none when all are, partial when some give values', () => {
        expect(outcomeOf('monthly', ['2025W2', '2025W3'])).toEqual(
            none(['PERIOD_TOO_SHORT'])
        )
        expect(outcomeOf('monthly', ['202501', '2025W2'])).toEqual(
            partial(['PERIOD_TOO_SHORT'])
        )
        expect(outcomeOf('monthly', ['202501', 'NEXT_CENTURY'])).toEqual(
            unknown(['UNKNOWN_PERIOD'])
        )
        // Nothing from one, and the other can't be told
        expect(outcomeOf('monthly', ['NEXT_CENTURY', '2025W2'])).toEqual(
            unknown(['PERIOD_TOO_SHORT', 'UNKNOWN_PERIOD'])
        )
    })

    describe('relative periods', () => {
        it('read their type', () => {
            expect(outcomeOf('monthly', ['LAST_12_MONTHS'])).toEqual(full())
            expect(outcomeOf('monthly', ['LAST_7_DAYS'])).toEqual(
                none(['PERIOD_TOO_SHORT'])
            )
        })

        it('hold when every type they could be agrees', () => {
            expect(outcomeOf('monthly', ['LAST_4_WEEKS'])).toEqual(
                none(['PERIOD_TOO_SHORT'])
            )
            expect(outcomeOf('monthly', ['THIS_FINANCIAL_YEAR'])).toEqual(
                full()
            )
            // Yearly data gives nothing in any financial year
            expect(outcomeOf('yearly', ['THIS_FINANCIAL_YEAR'])).toEqual(
                none(['PERIOD_TYPE_MISMATCH'])
            )
        })

        it('are unknown when their type depends on a setting not given', () => {
            expect(outcomeOf('weekly', ['LAST_4_WEEKS'])).toEqual(
                unknown(['SETTING_MISSING'])
            )
            expect(outcomeOf('financialOct', ['THIS_FINANCIAL_YEAR'])).toEqual(
                unknown(['SETTING_MISSING'])
            )
        })

        it('take the settings as options', () => {
            expect(
                outcomeOf('weekly', ['LAST_4_WEEKS'], {
                    weeklyPeriodType: 'Weekly',
                })
            ).toEqual(full())
            expect(
                outcomeOf('weekly', ['LAST_4_WEEKS'], {
                    weeklyPeriodType: 'WeeklySunday',
                })
            ).toEqual(none(['PERIOD_TYPE_MISMATCH']))
            expect(
                outcomeOf('financialOct', ['THIS_FINANCIAL_YEAR'], {
                    financialYearPeriodType: 'FinancialOct',
                })
            ).toEqual(full())
        })

        it('do not tell whether they align with the data', () => {
            expect(
                compatibilityOf('monthly', ['LAST_12_MONTHS']).periods[0]
                    .alignsWithData
            ).toBeNull()
        })
    })

    describe('alignsWithData', () => {
        const alignsOf = (id, period, options) =>
            compatibilityOf(id, [period], options).periods[0].alignsWithData

        it('is true when the period is whole data periods', () => {
            expect(alignsOf('monthly', '2025Q1')).toBe(true)
            expect(alignsOf('population', '2025')).toBe(true)
        })

        it('is false when data periods cross its edges', () => {
            expect(alignsOf('weekly', '202501')).toBe(false)
            expect(alignsOf('weekly', '2025')).toBe(false)
        })

        it('is null when it cannot be told', () => {
            expect(alignsOf('monthly', 'Yearly')).toBeNull()
            expect(alignsOf('monthly', '2025W2')).toBeNull()
            expect(alignsOf('twoYearly', 'TwoYearly')).toBeNull()
        })

        it('works in other calendars', () => {
            expect(alignsOf('monthly', '2081Q1', { calendar: 'nepali' })).toBe(
                true
            )
            expect(alignsOf('weekly', '208101', { calendar: 'nepali' })).toBe(
                false
            )
        })

        it('is null when a data type has no dates', () => {
            const profile = getDataItemProfile(
                { id: 'mixed', dimensionItemType: 'DATA_ELEMENT' },
                {
                    dataElements: {
                        mixed: dataElement(['Monthly', 'TwoYearly']),
                    },
                }
            )

            expect(
                getDataItemProfileCompatibility(profile, { periods: ['2025'] })
                    .periods[0]
            ).toMatchObject({ status: 'partial', alignsWithData: true })
        })
    })
})

describe('getDataItemProfileCompatibility, with org units', () => {
    it('judges periods and org units apart, and adds them up overall', () => {
        const result = getDataItemProfileCompatibility(
            orgUnitProfileOf('facility'),
            { periods: ['2025Q1'], orgUnits: ['nationUnit1', 'facilityDDD'] },
            { orgUnitCoverage: ORG_UNIT_COVERAGE }
        )

        expect(result).toMatchObject({
            status: 'partial',
            reasons: ['ASSIGNED_AT_HIGHER_LEVEL', 'PARTLY_ASSIGNED'],
            periods: [{ id: '2025Q1', status: 'full' }],
            orgUnits: [
                { id: 'nationUnit1', status: 'full' },
                { id: 'facilityDDD', status: 'none' },
            ],
        })
    })

    it('judges each period at each org unit overall, with only the data sets assigned there', () => {
        const result = getDataItemProfileCompatibility(
            orgUnitProfileOf('twoForms'),
            { periods: ['2025W2'], orgUnits: ['facilityAAA'] },
            { orgUnitCoverage: ORG_UNIT_COVERAGE }
        )

        // Apart: the weekly data set fills weeks; the monthly one is assigned at facilityAAA
        expect(result.periods[0].status).toBe('partial')
        expect(result.orgUnits[0].status).toBe('full')
        // Together: at facilityAAA, only the monthly one counts, and it can't fill a week
        expect(result).toMatchObject({
            status: 'none',
            reasons: ['PERIOD_TOO_SHORT'],
        })
    })

    it('leaves org units out when none are asked', () => {
        expect(
            getDataItemProfileCompatibility(orgUnitProfileOf('facility'), {
                periods: ['2025Q1'],
            })
        ).not.toHaveProperty('orgUnits')
    })

    it('judges org units alone', () => {
        expect(
            getDataItemProfileCompatibility(
                orgUnitProfileOf('facility'),
                { orgUnits: ['districtAAA'] },
                { orgUnitCoverage: ORG_UNIT_COVERAGE }
            )
        ).toMatchObject({ status: 'full', periods: [] })
    })
})
