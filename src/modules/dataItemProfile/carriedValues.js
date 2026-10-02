import {
    convertFromIso8601,
    convertToIso8601,
} from '@dhis2/multi-calendar-dates'
import { getFixedPeriodOfTypeByDate } from './periodTypeRelations.js'

/* How analytics answers FIRST and LAST (checked by the test tool on 2.40 to
 * 2.44): a data period counts when it ended by the end of the period asked
 * for, and the year in its id is one of the calendar years the request's
 * periods touch. FIRST takes the earliest that counts, LAST the latest; none
 * gives no value. So FIRST in July gives January's value, and LAST on
 * 1 January gives nothing. */

const ISO_CALENDARS = ['gregory', 'iso8601']

// November types name the year they end in: 2025NovQ1 is November 2024 to January 2025
const NAMED_BY_END_YEAR = ['QuarterlyNov', 'SixMonthlyNov', 'FinancialNov']

const MAX_STEPS = 20

const pad = (number, length = 2) => String(number).padStart(length, '0')

const getYear = (date) => Number(date.slice(0, 4))

const shiftIsoDate = (isoDate, days) => {
    const date = new Date(`${isoDate}T00:00:00Z`)
    date.setUTCDate(date.getUTCDate() + days)

    return date.toISOString().slice(0, 10)
}

const shiftDate = (date, days, calendar) => {
    if (ISO_CALENDARS.includes(calendar)) {
        return shiftIsoDate(date, days)
    }

    const iso = convertToIso8601(date, calendar)
    const shifted = shiftIsoDate(
        `${pad(iso.year, 4)}-${pad(iso.month)}-${pad(iso.day)}`,
        days
    )
    const { year, eraYear, month, day } = convertFromIso8601(shifted, calendar)

    return `${pad(eraYear ?? year, 4)}-${pad(month)}-${pad(day)}`
}

// The year in a data period's id, which places it in analytics' partitions
const getIdYear = (period, periodType) =>
    NAMED_BY_END_YEAR.includes(periodType)
        ? getYear(period.endDate)
        : Number(period.id.slice(0, 4))

const getLastPeriodEndingBy = (periodType, date, calendar) => {
    const holding = getFixedPeriodOfTypeByDate(periodType, date, calendar)

    if (!holding || holding.endDate <= date) {
        return holding
    }

    return getFixedPeriodOfTypeByDate(
        periodType,
        shiftDate(holding.startDate, -1, calendar),
        calendar
    )
}

const getLatestCounting = ({ periodType, dates, years, calendar }) => {
    let date = dates.endDate

    for (let step = 0; step < MAX_STEPS; step++) {
        const period = getLastPeriodEndingBy(periodType, date, calendar)

        if (!period) {
            return null
        }

        const idYear = getIdYear(period, periodType)

        if (years.includes(idYear)) {
            return period
        }

        const lowerYears = years.filter((year) => year < idYear)

        if (!lowerYears.length) {
            return null
        }

        // Jump towards the next year that counts, one period at a time at most
        const yearEnd = `${pad(Math.max(...lowerYears) + 1, 4)}-12-31`
        const before = shiftDate(period.startDate, -1, calendar)
        date = yearEnd < before ? yearEnd : before
    }

    return null
}

const getEarliestCounting = ({ periodType, dates, years, calendar }) => {
    const firstYear = Math.min(...years)
    let period = getFixedPeriodOfTypeByDate(
        periodType,
        `${pad(firstYear, 4)}-01-01`,
        calendar
    )

    for (let step = 0; period && step < MAX_STEPS; step++) {
        if (getIdYear(period, periodType) >= firstYear) {
            return period.endDate <= dates.endDate ? period : null
        }

        period = getFixedPeriodOfTypeByDate(
            periodType,
            shiftDate(period.endDate, 1, calendar),
            calendar
        )
    }

    return null
}

/**
 * The data period whose value analytics returns for FIRST or LAST data of
 * `periodType`, in a period with `dates`, when the request touches the
 * calendar `years`; null when there is none.
 */
export const getCarriedSource = ({
    periodAggregationType,
    periodType,
    dates,
    years,
    calendar = 'gregory',
}) => {
    if (!years.length) {
        return null
    }

    const query = { periodType, dates, years, calendar }

    return periodAggregationType === 'FIRST'
        ? getEarliestCounting(query)
        : getLatestCounting(query)
}

// The calendar years a period's dates fall in
export const getYearsTouched = ({ startDate, endDate }) => {
    const years = []

    for (let year = getYear(startDate); year <= getYear(endDate); year++) {
        years.push(year)
    }

    return years
}
