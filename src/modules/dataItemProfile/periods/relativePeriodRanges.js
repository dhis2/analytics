import { fromIsoDate, pad } from './calendarDates.js'
import { memoize } from './memoize.js'
import {
    getFixedPeriodOfTypeByDate,
    getNextPeriod,
    getPreviousPeriod,
} from './periodRanges.js'
import { getRelativePeriodShape, isPeriodType } from './periodTypes.js'

// Today in the user's time zone, as an ISO date
const getLocalIsoDate = () => {
    const now = new Date()

    return [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
    ].join('-')
}

// Far more than the longest relative period (LAST_52_WEEKS, LAST_180_DAYS…)
const MAX_PERIODS = 400

const stepPeriods = (period, steps, { periodType, calendar }) => {
    const step = steps < 0 ? getPreviousPeriod : getNextPeriod
    let current = period

    for (let i = 0; current && i < Math.abs(steps); i++) {
        current = step(periodType, current, calendar)
    }

    return current
}

// Weeks belong to the year that holds their Thursday: 4 January and 28 December always do
const getYearEdges = (periodType, year) =>
    periodType.startsWith('Weekly')
        ? [`${pad(year, 4)}-01-04`, `${pad(year, 4)}-12-28`]
        : [`${pad(year, 4)}-01-01`, `${pad(year, 4)}-12-31`]

/* The first and last fixed periods of a relative period: from the period
 * holding `date`, `offset` periods away for the last one, `duration` periods
 * long. The "this year" ones (MONTHS_THIS_YEAR…) cover every period of the
 * year. */
const getEdgePeriods = (periodId, date, { periodType, calendar }) => {
    const { offset, duration } = getRelativePeriodShape(periodId)

    if (periodId.endsWith('_THIS_YEAR')) {
        return getYearEdges(periodType, Number(date.slice(0, 4))).map((edge) =>
            getFixedPeriodOfTypeByDate(periodType, edge, calendar)
        )
    }

    const current = getFixedPeriodOfTypeByDate(periodType, date, calendar)
    const context = { periodType, calendar }
    const last = current && stepPeriods(current, offset, context)
    const first = last && stepPeriods(last, -(duration - 1), context)

    return [first, last]
}

const resolveRelativePeriod = memoize(
    (periodId, periodType, { calendar, date }) => {
        const [first, last] = getEdgePeriods(periodId, date, {
            periodType,
            calendar,
        })

        if (!first || !last) {
            return null
        }

        const periods = [first]

        while (
            periods[periods.length - 1].id !== last.id &&
            periods.length < MAX_PERIODS
        ) {
            const next = getNextPeriod(
                periodType,
                periods[periods.length - 1],
                calendar
            )

            if (!next) {
                return null
            }

            periods.push(next)
        }

        return periods
    },
    {
        getKey: (periodId, periodType, { calendar, date }) =>
            [periodId, periodType, calendar, date].join('|'),
    }
)

/**
 * The fixed periods of `periodType` a relative period covers, as analytics
 * resolves it on `relativePeriodDate` (an ISO date, today by default), in
 * date order; null when it can't be told.
 */
export const getRelativePeriodFixedPeriods = (
    periodId,
    periodType,
    { calendar = 'gregory', relativePeriodDate } = {}
) => {
    const date = fromIsoDate(relativePeriodDate ?? getLocalIsoDate(), calendar)

    if (
        !getRelativePeriodShape(periodId) ||
        !isPeriodType(periodType) ||
        !date
    ) {
        return null
    }

    return resolveRelativePeriod(periodId, periodType, { calendar, date })
}
