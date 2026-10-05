import {
    getNovemberPeriodByDate,
    getNovemberPeriodDates,
    isNovemberPeriodId,
    isNovemberPeriodType,
} from '../multiCalendarPatches.js'

describe('multiCalendarPatches', () => {
    it('tells November periods and types apart', () => {
        expect(isNovemberPeriodId('2025NovQ1')).toBe(true)
        expect(isNovemberPeriodId('2025Nov')).toBe(true)
        expect(isNovemberPeriodId('2025Q1')).toBe(false)
        expect(isNovemberPeriodType('SixMonthlyNov')).toBe(true)
        expect(isNovemberPeriodType('SixMonthly')).toBe(false)
        expect(isNovemberPeriodType('toString')).toBe(false)
    })

    it('dates November periods by the year they end in', () => {
        expect(getNovemberPeriodDates('2025Nov')).toEqual({
            startDate: '2024-11-01',
            endDate: '2025-10-31',
        })
        expect(getNovemberPeriodDates('2025NovS2')).toEqual({
            startDate: '2025-05-01',
            endDate: '2025-10-31',
        })
    })

    it.each([
        ['FinancialNov', '2024-11-01', '2025Nov'],
        ['FinancialNov', '2025-10-31', '2025Nov'],
        ['QuarterlyNov', '2024-12-15', '2025NovQ1'],
        ['QuarterlyNov', '2025-02-01', '2025NovQ2'],
        ['SixMonthlyNov', '2025-05-01', '2025NovS2'],
    ])('finds the %s period holding %s: %s', (periodType, date, id) => {
        expect(getNovemberPeriodByDate(periodType, date).id).toBe(id)
    })
})
