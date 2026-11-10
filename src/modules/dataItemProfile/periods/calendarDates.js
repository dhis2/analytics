import {
    convertFromIso8601,
    convertToIso8601,
} from '@dhis2/multi-calendar-dates'

/* Dates are YYYY-MM-DD strings in the server's calendar. Other calendars are
 * supported: their dates are converted to ISO for analytics and back for
 * multi-calendar-dates. These need no conversion (gregorian is the id DHIS2
 * gives the gregorian calendar). */
const ISO_CALENDARS = new Set(['gregory', 'gregorian', 'iso8601'])

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

// A conversion multi-calendar-dates can't make (an era it doesn't match) gives null
const convertOrNull = (convert) => {
    try {
        return convert()
    } catch {
        return null
    }
}

// A date of the ISO calendar (YYYY-MM-DD) in the given calendar, or null
export const fromIsoDate = (isoDate, calendar = 'gregory') => {
    if (isIsoCalendar(calendar)) {
        return isoDate
    }

    return convertOrNull(() => {
        const { year, eraYear, month, day } = convertFromIso8601(
            isoDate,
            calendar
        )

        return formatDate({ year: eraYear ?? year, month, day })
    })
}

// The date `days` later (or earlier, when negative), in the same calendar, or null
export const shiftDate = (date, days, calendar = 'gregory') => {
    if (isIsoCalendar(calendar)) {
        return shiftIsoDate(date, days)
    }

    const isoDate = convertOrNull(() =>
        formatDate(convertToIso8601(date, calendar))
    )

    return isoDate && fromIsoDate(shiftIsoDate(isoDate, days), calendar)
}
