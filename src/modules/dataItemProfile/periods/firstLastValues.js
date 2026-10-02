import { PERIOD_AGGREGATION_FIRST } from '../constants.js'
import { getYear, pad, shiftDate } from './calendarDates.js'
import { getPeriodIdYear } from './multiCalendarPatches.js'
import { getFixedPeriodOfTypeByDate } from './periodRanges.js'

/* How analytics answers FIRST and LAST data (checked by the test tool on 2.40
 * to 2.44): a data period counts when it ended by the end of the period asked
 * for, and the year in its id is one of the calendar years the request's
 * periods touch. FIRST takes the earliest that counts, LAST the latest; none
 * gives no value. So FIRST in July gives January's value, and LAST on
 * 1 January gives nothing. */

// Enough to cross the years between two in a request, one period at a time at most
const MAX_STEPS = 20

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

        const idYear = getPeriodIdYear(period, periodType)

        if (years.includes(idYear)) {
            return period
        }

        const lowerYears = years.filter((year) => year < idYear)

        if (!lowerYears.length) {
            return null
        }

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
        if (getPeriodIdYear(period, periodType) >= firstYear) {
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
export const getFirstOrLastValuePeriod = ({
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

    return periodAggregationType === PERIOD_AGGREGATION_FIRST
        ? getEarliestCounting(query)
        : getLatestCounting(query)
}

// The calendar years a range's dates fall in
export const getYearsTouched = ({ startDate, endDate }) => {
    const years = []

    for (let year = getYear(startDate); year <= getYear(endDate); year++) {
        years.push(year)
    }

    return years
}
