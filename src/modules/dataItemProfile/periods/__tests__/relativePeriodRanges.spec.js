import { getRelativePeriodFixedPeriods } from '../relativePeriodRanges.js'

const ON_15_JUNE_2025 = { relativePeriodDate: '2025-06-15' }
const idsOf = (periodId, periodType, options = ON_15_JUNE_2025) =>
    getRelativePeriodFixedPeriods(periodId, periodType, options)?.map(
        ({ id }) => id
    )

describe('getRelativePeriodFixedPeriods', () => {
    it('resolves this and last periods from the date', () => {
        expect(idsOf('THIS_MONTH', 'Monthly')).toEqual(['202506'])
        expect(idsOf('LAST_MONTH', 'Monthly')).toEqual(['202505'])
        expect(idsOf('LAST_YEAR', 'Yearly')).toEqual(['2024'])
    })

    it('resolves the periods before this one, oldest first', () => {
        expect(idsOf('LAST_3_MONTHS', 'Monthly')).toEqual([
            '202503',
            '202504',
            '202505',
        ])
        expect(idsOf('LAST_12_MONTHS', 'Monthly')).toHaveLength(12)
        expect(idsOf('LAST_7_DAYS', 'Daily')).toEqual([
            '20250608',
            '20250609',
            '20250610',
            '20250611',
            '20250612',
            '20250613',
            '20250614',
        ])
    })

    it('resolves the periods of this year, all of them', () => {
        expect(idsOf('MONTHS_THIS_YEAR', 'Monthly')).toEqual([
            '202501',
            '202502',
            '202503',
            '202504',
            '202505',
            '202506',
            '202507',
            '202508',
            '202509',
            '202510',
            '202511',
            '202512',
        ])
        expect(idsOf('QUARTERS_THIS_YEAR', 'Quarterly')).toEqual([
            '2025Q1',
            '2025Q2',
            '2025Q3',
            '2025Q4',
        ])
    })

    it('takes the weeks that belong to this year', () => {
        const weeks = idsOf('WEEKS_THIS_YEAR', 'Weekly')

        expect(weeks[0]).toBe('2025W1')
        expect(weeks.at(-1)).toBe('2025W52')
    })

    it('resolves the type a setting gives', () => {
        expect(idsOf('THIS_WEEK', 'WeeklyWednesday')).toEqual(['2025WedW24'])
        expect(idsOf('THIS_FINANCIAL_YEAR', 'FinancialApril')).toEqual([
            '2025April',
        ])
    })

    it('resolves dates of other calendars', () => {
        expect(
            idsOf('THIS_MONTH', 'Monthly', {
                calendar: 'nepali',
                relativePeriodDate: '2025-06-15',
            })
        ).toEqual(['208202'])
    })

    it('resolves from today by default', () => {
        expect(idsOf('THIS_YEAR', 'Yearly', {})).toEqual([
            String(new Date().getFullYear()),
        ])
    })

    it('cannot tell for an unknown relative period or period type', () => {
        expect(idsOf('LAST_7_DECADES', 'Yearly')).toBeUndefined()
        expect(idsOf('THIS_MONTH', 'Hourly')).toBeUndefined()
    })
})

describe('getRelativePeriodFixedPeriods, in a calendar it cannot convert to', () => {
    it('cannot tell', () => {
        expect(
            idsOf('THIS_MONTH', 'Monthly', {
                calendar: 'noSuchCalendar',
                relativePeriodDate: '2025-06-15',
            })
        ).toBeUndefined()
    })
})
