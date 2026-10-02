import {
    getFirstOrLastValuePeriod,
    getYearsTouched,
} from '../firstLastValues.js'
import { getPeriodDates } from '../periodRanges.js'

const sourceOf = ({
    periodAggregationType = 'LAST',
    periodType,
    period,
    years,
    calendar,
}) => {
    const dates = getPeriodDates(period, calendar)

    return getFirstOrLastValuePeriod({
        periodAggregationType,
        periodType,
        dates,
        years: years ?? getYearsTouched(dates),
        calendar,
    })
}

describe('getYearsTouched', () => {
    it('lists the calendar years a period falls in', () => {
        expect(getYearsTouched(getPeriodDates('2025W1'))).toEqual([2024, 2025])
        expect(getYearsTouched(getPeriodDates('2025WedW1'))).toEqual([2025])
        expect(getYearsTouched(getPeriodDates('2024April'))).toEqual([
            2024, 2025,
        ])
    })
})

describe('getFirstOrLastValuePeriod', () => {
    describe('LAST', () => {
        it('takes the latest data period that ended by the end of the period', () => {
            expect(
                sourceOf({ periodType: 'Monthly', period: '20250715' })
            ).toMatchObject({ id: '202506' })
            expect(
                sourceOf({ periodType: 'Monthly', period: '2025Q3' })
            ).toMatchObject({ id: '202509' })
        })

        it('counts only data periods of the years touched, by their id', () => {
            expect(
                sourceOf({ periodType: 'Monthly', period: '20250101' })
            ).toBeNull()
            // 2025W1 starts in 2024, so December 2024 counts
            expect(
                sourceOf({ periodType: 'Monthly', period: '2025W1' })
            ).toMatchObject({ id: '202412' })
            // 2025Nov (November 2024 to October 2025) is a 2025 period
            expect(
                sourceOf({ periodType: 'FinancialNov', period: '20251101' })
            ).toMatchObject({ startDate: '2024-11-01' })
        })

        it('skips years the request does not touch', () => {
            expect(
                sourceOf({
                    periodType: 'Monthly',
                    period: '20250715',
                    years: [2023, 2025],
                })
            ).toMatchObject({ id: '202506' })
            // 2024 isn't touched: December 2023 is the latest that counts
            expect(
                sourceOf({
                    periodType: 'Monthly',
                    period: '20250101',
                    years: [2023, 2025],
                })
            ).toMatchObject({ id: '202312' })
            expect(
                sourceOf({
                    periodType: 'Monthly',
                    period: '20250101',
                    years: [2026],
                })
            ).toBeNull()
        })
    })

    describe('FIRST', () => {
        it('takes the earliest data period of the years touched', () => {
            expect(
                sourceOf({
                    periodAggregationType: 'FIRST',
                    periodType: 'Monthly',
                    period: '202507',
                })
            ).toMatchObject({ id: '202501' })
            expect(
                sourceOf({
                    periodAggregationType: 'FIRST',
                    periodType: 'Daily',
                    period: '20250715',
                    years: [2024, 2025],
                })
            ).toMatchObject({ id: '20240101' })
        })

        it('needs that period to end by the end of the period asked for', () => {
            expect(
                sourceOf({
                    periodAggregationType: 'FIRST',
                    periodType: 'Monthly',
                    period: '20250101',
                })
            ).toBeNull()
        })

        it('starts from the first period whose id names the year', () => {
            // 2024April holds 1 January 2025, but is a 2024 period
            expect(
                sourceOf({
                    periodAggregationType: 'FIRST',
                    periodType: 'FinancialApril',
                    period: '2025April',
                    years: [2025, 2026],
                })
            ).toMatchObject({ id: '2025April' })
        })
    })

    it('is null without years, or for a type without dates', () => {
        expect(
            sourceOf({ periodType: 'Monthly', period: '20250715', years: [] })
        ).toBeNull()
        expect(
            sourceOf({ periodType: 'TwoYearly', period: '20250715' })
        ).toBeNull()
        expect(
            sourceOf({
                periodAggregationType: 'FIRST',
                periodType: 'TwoYearly',
                period: '20250715',
            })
        ).toBeNull()
    })

    it('works in other calendars', () => {
        expect(
            sourceOf({
                periodType: 'Monthly',
                period: '20810415',
                calendar: 'nepali',
            })
        ).toMatchObject({ id: '208103' })
        expect(
            sourceOf({
                periodAggregationType: 'FIRST',
                periodType: 'Monthly',
                period: '208104',
                calendar: 'nepali',
            })
        ).toMatchObject({ id: '208101' })
    })
})
