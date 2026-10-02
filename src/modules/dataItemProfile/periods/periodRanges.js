import {
    createFixedPeriodFromPeriodId,
    getFixedPeriodByDate,
} from '@dhis2/multi-calendar-dates'
import { SERVER_PT_TO_MULTI_CALENDAR_PT } from '../../../components/PeriodDimension/utils/enabledPeriodTypes.js'
import {
    PERIOD_RANGE_CONTAINS,
    PERIOD_RANGE_DISJOINT,
    PERIOD_RANGE_OVERLAPS,
    PERIOD_RANGE_SAME,
    PERIOD_RANGE_WITHIN,
} from '../constants.js'
import { isIsoCalendar } from './calendarDates.js'
import {
    getNovemberPeriodByDate,
    getNovemberPeriodDates,
    isNovemberPeriodId,
    isNovemberPeriodType,
} from './multiCalendarPatches.js'

/* A period range is { startDate, endDate }, YYYY-MM-DD strings in one
 * calendar, so they compare as strings */

// A fixed period's range, or null for an id that can't be read
export const getPeriodDates = (periodId, calendar = 'gregory') => {
    if (isNovemberPeriodId(periodId)) {
        return isIsoCalendar(calendar) ? getNovemberPeriodDates(periodId) : null
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

/**
 * How range `a` relates to range `b`: the same dates, within it, containing
 * it, overlapping it, or disjoint.
 */
export const comparePeriodRanges = (a, b) => {
    if (a.startDate === b.startDate && a.endDate === b.endDate) {
        return PERIOD_RANGE_SAME
    }

    if (a.endDate < b.startDate || b.endDate < a.startDate) {
        return PERIOD_RANGE_DISJOINT
    }

    if (a.startDate >= b.startDate && a.endDate <= b.endDate) {
        return PERIOD_RANGE_WITHIN
    }

    if (b.startDate >= a.startDate && b.endDate <= a.endDate) {
        return PERIOD_RANGE_CONTAINS
    }

    return PERIOD_RANGE_OVERLAPS
}

// The period of `periodType` that holds `date` ({ id, startDate, endDate }), or null
export const getFixedPeriodOfTypeByDate = (
    periodType,
    date,
    calendar = 'gregory'
) => {
    if (isNovemberPeriodType(periodType)) {
        return isIsoCalendar(calendar)
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
        ? comparePeriodRanges(covering, range) === PERIOD_RANGE_SAME
        : null
}
