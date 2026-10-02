import {
    convertFromIso8601,
    convertToIso8601,
} from '@dhis2/multi-calendar-dates'

/* Dates are YYYY-MM-DD strings in the server's calendar. Other calendars are
 * supported: their dates are converted to ISO for analytics and back for
 * multi-calendar-dates. These two need no conversion. */
const ISO_CALENDARS = new Set(['gregory', 'iso8601'])

export const isIsoCalendar = (calendar = 'gregory') =>
    ISO_CALENDARS.has(calendar)

export const pad = (number, length = 2) => String(number).padStart(length, '0')

export const formatDate = ({ year, month, day }) =>
    `${pad(year, 4)}-${pad(month)}-${pad(day)}`

export const getYear = (date) => Number(date.slice(0, 4))

const shiftIsoDate = (isoDate, days) => {
    const date = new Date(`${isoDate}T00:00:00Z`)
    date.setUTCDate(date.getUTCDate() + days)

    return date.toISOString().slice(0, 10)
}

// The date `days` later (or earlier, when negative), in the same calendar
export const shiftDate = (date, days, calendar = 'gregory') => {
    if (isIsoCalendar(calendar)) {
        return shiftIsoDate(date, days)
    }

    const shifted = shiftIsoDate(
        formatDate(convertToIso8601(date, calendar)),
        days
    )
    const { year, eraYear, month, day } = convertFromIso8601(shifted, calendar)

    return formatDate({ year: eraYear ?? year, month, day })
}

// Analytics takes ISO dates
export const toIsoDate = (date, calendar = 'gregory') =>
    !date || isIsoCalendar(calendar)
        ? date
        : formatDate(convertToIso8601(date, calendar))
