import {
    formatDate,
    getYear,
    isIsoCalendar,
    pad,
    shiftDate,
    fromIsoDate,
} from '../calendarDates.js'

describe('calendarDates', () => {
    it('needs no conversion for the ISO calendars only', () => {
        expect(isIsoCalendar()).toBe(true)
        expect(isIsoCalendar('iso8601')).toBe(true)
        expect(isIsoCalendar('gregorian')).toBe(true)
        expect(isIsoCalendar('nepali')).toBe(false)
    })

    it('formats and reads dates', () => {
        expect(pad(7)).toBe('07')
        expect(pad(825, 4)).toBe('0825')
        expect(formatDate({ year: 2025, month: 1, day: 6 })).toBe('2025-01-06')
        expect(getYear('2025-01-06')).toBe(2025)
    })

    it('shifts a date by days, across months and years', () => {
        expect(shiftDate('2025-01-01', -1)).toBe('2024-12-31')
        expect(shiftDate('2024-02-28', 1, 'iso8601')).toBe('2024-02-29')
    })

    it('shifts a date of another calendar in that calendar', () => {
        expect(shiftDate('2081-01-03', 1, 'nepali')).toBe('2081-01-04')
        expect(fromIsoDate('2024-04-16', 'nepali')).toBe('2081-01-04')
    })
})

describe('fromIsoDate', () => {
    it('keeps ISO dates, and converts them to other calendars', () => {
        expect(fromIsoDate('2025-01-06')).toBe('2025-01-06')
        expect(fromIsoDate('2024-04-15', 'nepali')).toBe('2081-01-03')
    })
})

describe('a conversion that fails', () => {
    it('gives null, never throws', () => {
        expect(fromIsoDate('2024-04-15', 'noSuchCalendar')).toBeNull()
        expect(shiftDate('2081-01-03', 1, 'noSuchCalendar')).toBeNull()
    })
})
