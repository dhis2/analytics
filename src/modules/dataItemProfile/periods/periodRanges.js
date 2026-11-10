import {
    createFixedPeriodFromPeriodId,
    generateFixedPeriods,
} from '@dhis2/multi-calendar-dates'
import { SERVER_PT_TO_MULTI_CALENDAR_PT } from '../../../components/PeriodDimension/utils/enabledPeriodTypes.js'
import { getYear, isIsoCalendar, shiftDate } from './calendarDates.js'
import { memoize } from './memoize.js'
import {
    getNovemberPeriodByDate,
    getNovemberPeriodDates,
    isNovemberPeriodId,
    isNovemberPeriodType,
} from './multiCalendarPatches.js'
import { getPeriodTypeOfPeriodId } from './periodTypes.js'

/* A period range is { startDate, endDate }, YYYY-MM-DD strings in one
 * calendar, so they compare as strings */

const isYearLongType = (libraryPeriodType) =>
    libraryPeriodType === 'YEARLY' || libraryPeriodType.startsWith('FY')

/* Every period of a type in one year of the calendar (yearly and financial
 * types: the one starting that year), built once */
const getPeriodsOfYear = memoize(
    (libraryPeriodType, year, calendar) => {
        try {
            return generateFixedPeriods({
                year,
                periodType: libraryPeriodType,
                calendar,
                locale: 'en',
                ...(isYearLongType(libraryPeriodType) && { yearsCount: 1 }),
            })
        } catch {
            return []
        }
    },
    { maxSize: 500 }
)

const readPeriodDates = memoize((periodId, calendar) => {
    if (isNovemberPeriodId(periodId)) {
        return isIsoCalendar(calendar) ? getNovemberPeriodDates(periodId) : null
    }

    // The id names its year: the period is in that year's list
    const libraryPeriodType =
        SERVER_PT_TO_MULTI_CALENDAR_PT[getPeriodTypeOfPeriodId(periodId)]
    const listed =
        libraryPeriodType &&
        getPeriodsOfYear(
            libraryPeriodType,
            Number(periodId.slice(0, 4)),
            calendar
        ).find(({ id }) => id === periodId)

    if (listed) {
        return { startDate: listed.startDate, endDate: listed.endDate }
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
})

// A fixed period's range, or null for an id that can't be read
export const getPeriodDates = (periodId, calendar = 'gregory') =>
    readPeriodDates(periodId, calendar)

// Weeks and financial years can start in the year before or end in the year after
const findPeriodHolding = (libraryPeriodType, date, calendar) => {
    const year = getYear(date)

    for (const candidateYear of [year, year - 1, year + 1]) {
        const period = getPeriodsOfYear(
            libraryPeriodType,
            candidateYear,
            calendar
        ).find(({ startDate, endDate }) => startDate <= date && date <= endDate)

        if (period) {
            const { id, startDate, endDate } = period

            return { id, startDate, endDate }
        }
    }

    return null
}

// The period of `periodType` that holds `date` ({ id, startDate, endDate }), or null
export const getFixedPeriodOfTypeByDate = (
    periodType,
    date,
    calendar = 'gregory'
) => {
    if (!date) {
        return null
    }

    if (isNovemberPeriodType(periodType)) {
        return isIsoCalendar(calendar)
            ? getNovemberPeriodByDate(periodType, date)
            : null
    }

    const libraryPeriodType = SERVER_PT_TO_MULTI_CALENDAR_PT[periodType]

    return libraryPeriodType
        ? findPeriodHolding(libraryPeriodType, date, calendar)
        : null
}

// The period of the same type just before or just after `period`, or null
export const getPreviousPeriod = (periodType, period, calendar = 'gregory') =>
    getFixedPeriodOfTypeByDate(
        periodType,
        shiftDate(period.startDate, -1, calendar),
        calendar
    )

export const getNextPeriod = (periodType, period, calendar = 'gregory') =>
    getFixedPeriodOfTypeByDate(
        periodType,
        shiftDate(period.endDate, 1, calendar),
        calendar
    )

/**
 * The range from the start of the `periodType` period holding the start of
 * `range`, to the end of the one holding its end: the whole periods of that
 * type that cover it. Null when it can't be told.
 */
export const getCoveringPeriodRange = (
    range,
    periodType,
    calendar = 'gregory'
) => {
    const first = getFixedPeriodOfTypeByDate(
        periodType,
        range.startDate,
        calendar
    )
    const last = getFixedPeriodOfTypeByDate(periodType, range.endDate, calendar)

    if (!first || !last) {
        return null
    }

    return { startDate: first.startDate, endDate: last.endDate }
}

/**
 * Whether a range starts and ends on the edges of `periodType` periods, so
 * data of that type fits it exactly (a quarter on monthly data, not a month on
 * weekly data). Null when it can't be told.
 */
export const isAlignedWithPeriodType = (
    range,
    periodType,
    calendar = 'gregory'
) => {
    const covering = getCoveringPeriodRange(range, periodType, calendar)

    return covering
        ? covering.startDate === range.startDate &&
              covering.endDate === range.endDate
        : null
}
