import { PERIOD_TYPES } from '../../constants.js'
import {
    canAggregateInto,
    getCandidatePeriodTypes,
    getPeriodTypeOfPeriodId,
    getRelativePeriodTypeOptions,
    isPeriodType,
    isPeriodTypeSupported,
    sortPeriodTypes,
} from '../periodTypes.js'

describe('PERIOD_TYPES', () => {
    it('lists the 24 server period types', () => {
        expect(PERIOD_TYPES).toHaveLength(24)
        expect(isPeriodType('TwoYearly')).toBe(true)
        expect(isPeriodType('WEEKLY')).toBe(false)
    })
})

describe('sortPeriodTypes', () => {
    it('sorts by frequency, then in server order', () => {
        expect(
            sortPeriodTypes(['Yearly', 'WeeklyWednesday', 'Monthly', 'Weekly'])
        ).toEqual(['Weekly', 'WeeklyWednesday', 'Monthly', 'Yearly'])
    })
})

describe('getPeriodTypeOfPeriodId', () => {
    it.each([
        ['20250115', 'Daily'],
        ['2025W2', 'Weekly'],
        ['2025WedW2', 'WeeklyWednesday'],
        ['2025ThuW2', 'WeeklyThursday'],
        ['2025FriW2', 'WeeklyFriday'],
        ['2025SatW2', 'WeeklySaturday'],
        ['2025SunW2', 'WeeklySunday'],
        ['2025BiW2', 'BiWeekly'],
        ['202501', 'Monthly'],
        ['202501B', 'BiMonthly'],
        ['2025Q1', 'Quarterly'],
        ['2025NovQ1', 'QuarterlyNov'],
        ['2025S1', 'SixMonthly'],
        ['2025AprilS1', 'SixMonthlyApril'],
        ['2025NovS1', 'SixMonthlyNov'],
        ['2025', 'Yearly'],
        ['2025Feb', 'FinancialFeb'],
        ['2025April', 'FinancialApril'],
        ['2025July', 'FinancialJuly'],
        ['2025Aug', 'FinancialAug'],
        ['2025Sep', 'FinancialSep'],
        ['2025Oct', 'FinancialOct'],
        ['2025Nov', 'FinancialNov'],
    ])('%s is %s', (periodId, periodType) => {
        expect(getPeriodTypeOfPeriodId(periodId)).toBe(periodType)
    })

    it('is null for anything else', () => {
        expect(getPeriodTypeOfPeriodId('LAST_12_MONTHS')).toBeNull()
        expect(getPeriodTypeOfPeriodId('2025X1')).toBeNull()
    })
})

describe('getCandidatePeriodTypes', () => {
    it('takes a period type as it is', () => {
        expect(getCandidatePeriodTypes('TwoYearly')).toEqual(['TwoYearly'])
    })

    it('reads a fixed period', () => {
        expect(getCandidatePeriodTypes('2025WedW2')).toEqual([
            'WeeklyWednesday',
        ])
    })

    it.each([
        ['LAST_7_DAYS', ['Daily']],
        ['LAST_4_BIWEEKS', ['BiWeekly']],
        ['LAST_12_MONTHS', ['Monthly']],
        ['BIMONTHS_THIS_YEAR', ['BiMonthly']],
        ['LAST_4_QUARTERS', ['Quarterly']],
        ['LAST_2_SIXMONTHS', ['SixMonthly']],
        ['LAST_5_YEARS', ['Yearly']],
    ])('reads the relative period %s', (periodId, expected) => {
        expect(getCandidatePeriodTypes(periodId)).toEqual(expected)
    })

    it('gives every weekly type for relative weeks, unless the setting is known', () => {
        expect(getCandidatePeriodTypes('LAST_4_WEEKS')).toEqual([
            'Weekly',
            'WeeklyWednesday',
            'WeeklyThursday',
            'WeeklyFriday',
            'WeeklySaturday',
            'WeeklySunday',
        ])
        expect(
            getCandidatePeriodTypes('LAST_4_WEEKS', {
                weeklyPeriodType: 'WeeklySunday',
            })
        ).toEqual(['WeeklySunday'])
    })

    it('gives every financial type for relative financial years, unless the setting is known', () => {
        expect(getCandidatePeriodTypes('THIS_FINANCIAL_YEAR')).toHaveLength(7)
        expect(
            getCandidatePeriodTypes('THIS_FINANCIAL_YEAR', {
                financialYearPeriodType: 'FinancialOct',
            })
        ).toEqual(['FinancialOct'])
    })

    it('gives nothing for an id it cannot read', () => {
        expect(getCandidatePeriodTypes('NEXT_CENTURY')).toEqual([])
    })
})

describe('getRelativePeriodTypeOptions', () => {
    it('maps the system settings to period types', () => {
        expect(
            getRelativePeriodTypeOptions({
                analyticsWeeklyStart: 'WEEKLY_WEDNESDAY',
                analyticsFinancialYearStart: 'FINANCIAL_YEAR_OCTOBER',
            })
        ).toEqual({
            weeklyPeriodType: 'WeeklyWednesday',
            financialYearPeriodType: 'FinancialOct',
        })
    })

    it('leaves out unknown or missing settings', () => {
        expect(getRelativePeriodTypeOptions()).toEqual({
            weeklyPeriodType: undefined,
            financialYearPeriodType: undefined,
        })
    })
})

describe('isPeriodTypeSupported', () => {
    it('leaves out QuarterlyNov before 2.41', () => {
        expect(
            isPeriodTypeSupported('QuarterlyNov', { major: 2, minor: 40 })
        ).toBe(false)
        expect(
            isPeriodTypeSupported('QuarterlyNov', { major: 2, minor: 41 })
        ).toBe(true)
        expect(
            isPeriodTypeSupported('QuarterlyNov', { major: 3, minor: 0 })
        ).toBe(true)
        expect(isPeriodTypeSupported('Monthly', { major: 2, minor: 40 })).toBe(
            true
        )
    })

    it('supports every type without a version', () => {
        expect(isPeriodTypeSupported('QuarterlyNov')).toBe(true)
    })
})

describe('canAggregateInto', () => {
    it.each([
        ['Monthly', 'Monthly', true],
        ['Weekly', 'Monthly', true],
        ['Daily', 'TwoYearly', true],
        ['Monthly', 'FinancialApril', true],
        ['Monthly', 'Weekly', false],
        ['Yearly', 'Quarterly', false],
        ['WeeklyWednesday', 'Weekly', false],
        ['Weekly', 'WeeklyWednesday', false],
        ['Yearly', 'FinancialApril', false],
        ['Quarterly', 'QuarterlyNov', false],
        ['Weekly', 'BiWeekly', true],
        ['WeeklyWednesday', 'BiWeekly', true],
    ])('%s data into %s queries: %s', (data, query, expected) => {
        expect(canAggregateInto(data, query)).toBe(expected)
    })

    it('is null for an unknown type', () => {
        expect(canAggregateInto('Hourly', 'Monthly')).toBeNull()
        expect(canAggregateInto('Monthly', undefined)).toBeNull()
    })
})
