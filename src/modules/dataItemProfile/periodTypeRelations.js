import {
    convertToIso8601,
    createFixedPeriodFromPeriodId,
    getFixedPeriodByDate,
} from '@dhis2/multi-calendar-dates'
import { SERVER_PT_TO_MULTI_CALENDAR_PT } from '../../components/PeriodDimension/utils/enabledPeriodTypes.js'
import { getFrequencyOrder, isPeriodType } from './periodTypes.js'

export const PERIOD_RELATION_SAME = 'same'
export const PERIOD_RELATION_WITHIN = 'within'
export const PERIOD_RELATION_CONTAINS = 'contains'
export const PERIOD_RELATION_OVERLAPS = 'overlaps'
export const PERIOD_RELATION_DISJOINT = 'disjoint'

/**
 * Whether analytics adds data collected at `dataPeriodType` into periods of
 * `queryPeriodType`: only into the same type, or into a type with a higher
 * frequencyOrder. Another type of the same order (a Wednesday week for a
 * Monday week) gets nothing. Averaged data is repeated and FIRST and LAST
 * carried instead, see getDataItemProfileCompatibility. Null when either type
 * is unknown.
 */
export const aggregatesInto = (dataPeriodType, queryPeriodType) => {
    if (!isPeriodType(dataPeriodType) || !isPeriodType(queryPeriodType)) {
        return null
    }

    return (
        dataPeriodType === queryPeriodType ||
        getFrequencyOrder(queryPeriodType) > getFrequencyOrder(dataPeriodType)
    )
}

export const comparePeriodTypes = (a, b) =>
    getFrequencyOrder(a) - getFrequencyOrder(b)

const ISO_CALENDARS = ['gregory', 'iso8601']

/* November types name the year they end in: 2025Nov is November 2024 to
 * October 2025, 2025NovQ1 November 2024 to January 2025. multi-calendar-dates
 * 1.3.2 can't read the quarters and six-months, gives them ids the server
 * doesn't know (2024NovemberQ1), and puts 2025Nov a year late. */
const NOVEMBER_PERIOD_ID = /^(\d{4})Nov(?:([QS])([1-4]))?$/
const NOVEMBER_PERIOD_TYPE_SUFFIXES = {
    FinancialNov: { kind: '', months: 12 },
    QuarterlyNov: { kind: 'Q', months: 3 },
    SixMonthlyNov: { kind: 'S', months: 6 },
}

const pad = (number, length = 2) => String(number).padStart(length, '0')

const getNovemberPeriodDates = (periodId) => {
    const [, year, kind, number] = periodId.match(NOVEMBER_PERIOD_ID)
    const months = { Q: 3, S: 6 }[kind] ?? 12
    const firstMonth = 10 + (Number(number ?? 1) - 1) * months
    const start = new Date(Date.UTC(Number(year) - 1, firstMonth, 1))
    const end = new Date(Date.UTC(Number(year) - 1, firstMonth + months, 0))
    const toDate = (date) =>
        `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
            date.getUTCDate()
        )}`

    return { startDate: toDate(start), endDate: toDate(end) }
}

// The November period that holds an ISO date (YYYY-MM-DD)
const getNovemberPeriodByDate = (periodType, date) => {
    const { kind, months } = NOVEMBER_PERIOD_TYPE_SUFFIXES[periodType]
    const [year, month] = date.split('-').map(Number)
    const endYear = month >= 11 ? year + 1 : year
    const monthsSinceNovember = (month + 1) % 12
    const number = Math.floor(monthsSinceNovember / months) + 1
    const id = `${endYear}Nov${kind ? `${kind}${number}` : ''}`

    return { id, ...getNovemberPeriodDates(id) }
}

// Start and end dates in the calendar's own dates, or null for an unknown id
export const getPeriodDates = (periodId, calendar = 'gregory') => {
    if (NOVEMBER_PERIOD_ID.test(periodId)) {
        return ISO_CALENDARS.includes(calendar)
            ? getNovemberPeriodDates(periodId)
            : null
    }

    try {
        const { startDate, endDate } = createFixedPeriodFromPeriodId({
            periodId,
            calendar,
        })

        return { startDate, endDate }
    } catch {
        return null
    }
}

// Dates are YYYY-MM-DD strings of one calendar, so they compare as strings
export const getPeriodRelation = (a, b) => {
    if (a.startDate === b.startDate && a.endDate === b.endDate) {
        return PERIOD_RELATION_SAME
    }

    if (a.endDate < b.startDate || b.endDate < a.startDate) {
        return PERIOD_RELATION_DISJOINT
    }

    if (a.startDate >= b.startDate && a.endDate <= b.endDate) {
        return PERIOD_RELATION_WITHIN
    }

    if (b.startDate >= a.startDate && b.endDate <= a.endDate) {
        return PERIOD_RELATION_CONTAINS
    }

    return PERIOD_RELATION_OVERLAPS
}

export const getFixedPeriodOfTypeByDate = (
    periodType,
    date,
    calendar = 'gregory'
) => {
    if (NOVEMBER_PERIOD_TYPE_SUFFIXES[periodType]) {
        return ISO_CALENDARS.includes(calendar)
            ? getNovemberPeriodByDate(periodType, date)
            : null
    }

    const libraryPeriodType = SERVER_PT_TO_MULTI_CALENDAR_PT[periodType]

    if (!libraryPeriodType) {
        return null
    }

    try {
        return getFixedPeriodByDate({
            periodType: libraryPeriodType,
            date,
            calendar,
        })
    } catch {
        return null
    }
}

/**
 * The smallest range of whole `periodType` periods that covers `dates`, or
 * null when it can't be told.
 */
export const widenToWholePeriods = (
    dates,
    periodType,
    calendar = 'gregory'
) => {
    const first = getFixedPeriodOfTypeByDate(
        periodType,
        dates.startDate,
        calendar
    )
    const last = getFixedPeriodOfTypeByDate(periodType, dates.endDate, calendar)

    if (!first || !last) {
        return null
    }

    return { startDate: first.startDate, endDate: last.endDate }
}

/**
 * Whether a period starts and ends on the edges of `periodType`'s periods, so
 * data of that type fits it exactly (a quarter on monthly data, not a month on
 * weekly data). Null when it can't be told.
 */
export const periodNestsIn = (dates, periodType, calendar = 'gregory') => {
    const widened = widenToWholePeriods(dates, periodType, calendar)

    return widened
        ? getPeriodRelation(widened, dates) === PERIOD_RELATION_SAME
        : null
}

// Analytics takes ISO dates: dates of other calendars are converted
export const toIsoDate = (date, calendar = 'gregory') => {
    if (!date || ISO_CALENDARS.includes(calendar)) {
        return date
    }

    const { year, month, day } = convertToIso8601(date, calendar)

    return `${pad(year, 4)}-${pad(month)}-${pad(day)}`
}
