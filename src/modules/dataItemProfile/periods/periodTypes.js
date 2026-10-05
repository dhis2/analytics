import {
    FINANCIAL_YEAR_START_TO_PERIOD_TYPE,
    SERVER_PT_TO_MULTI_CALENDAR_PT,
    WEEKLY_START_TO_PERIOD_TYPE,
} from '../../../components/PeriodDimension/utils/enabledPeriodTypes.js'
import { PERIOD_TYPE_REGEX } from '../../../components/PeriodDimension/utils/fixedPeriods.js'
import { getRelativePeriodsDetails } from '../../../components/PeriodDimension/utils/relativePeriods.js'
import { PERIOD_TYPE_FREQUENCY_ORDER, PERIOD_TYPES } from '../constants.js'

const PERIOD_TYPE_NAMES = new Set(PERIOD_TYPES)

export const isPeriodType = (value) => PERIOD_TYPE_NAMES.has(value)

export const getFrequencyOrder = (periodType) =>
    PERIOD_TYPE_FREQUENCY_ORDER[periodType]

// Shortest first, then in the server's order
export const sortPeriodTypes = (periodTypes) =>
    [...periodTypes].sort(
        (a, b) =>
            getFrequencyOrder(a) - getFrequencyOrder(b) ||
            PERIOD_TYPES.indexOf(a) - PERIOD_TYPES.indexOf(b)
    )

/**
 * Whether analytics adds up values of data sets with `dataPeriodType` into
 * periods of `queryPeriodType`: it does into the same type and into any
 * longer type (a higher frequencyOrder), even when the periods don't nest
 * (Wednesday weeks into BiWeekly, checked by the test tool). A type of the
 * same length gets nothing (Wednesday weeks asked by Monday week). Null when
 * either type is unknown.
 */
export const canAggregateInto = (dataPeriodType, queryPeriodType) => {
    if (!isPeriodType(dataPeriodType) || !isPeriodType(queryPeriodType)) {
        return null
    }

    return (
        dataPeriodType === queryPeriodType ||
        getFrequencyOrder(queryPeriodType) > getFrequencyOrder(dataPeriodType)
    )
}

/* VERSION-TOGGLE: remove when 41 is the lowest supported version. Analytics
 * fails on QuarterlyNov periods in 2.40 ("Can't find resource for bundle …
 * key format.QuarterlyNov.startDate"), and answers from 2.41. */
const MIN_MINOR_VERSION_BY_PERIOD_TYPE = { QuarterlyNov: 41 }

// Without a server version, every type counts as supported
export const isPeriodTypeSupported = (periodType, serverVersion) =>
    !serverVersion ||
    serverVersion.major > 2 ||
    serverVersion.minor >= (MIN_MINOR_VERSION_BY_PERIOD_TYPE[periodType] ?? 0)

const SERVER_PERIOD_TYPE_BY_LIBRARY_TYPE = Object.fromEntries(
    Object.entries(SERVER_PT_TO_MULTI_CALENDAR_PT).map(
        ([serverType, libraryType]) => [libraryType, serverType]
    )
)

/* The period picker's PERIOD_TYPE_REGEX leaves out the November quarters and
 * six-months, since it doesn't offer them; analytics answers them */
const PERIOD_ID_PATTERNS = [
    ...Object.entries(PERIOD_TYPE_REGEX).map(([libraryType, regex]) => [
        SERVER_PERIOD_TYPE_BY_LIBRARY_TYPE[libraryType],
        regex,
    ]),
    ['QuarterlyNov', /^(\d{4})NovQ([1-4])$/],
    ['SixMonthlyNov', /^(\d{4})NovS([12])$/],
]

export const getPeriodTypeOfPeriodId = (periodId) =>
    PERIOD_ID_PATTERNS.find(([, regex]) => regex.test(periodId))?.[0] ?? null

let relativePeriodShapes

/* The type (category), offset and duration of a relative period, or
 * undefined: PeriodDimension builds its table, with names, on each call */
export const getRelativePeriodShape = (periodId) => {
    relativePeriodShapes ??= Object.fromEntries(
        Object.values(getRelativePeriodsDetails()).map(
            ({ id, type, offset, duration }) => [id, { type, offset, duration }]
        )
    )

    return relativePeriodShapes[periodId]
}

const WEEKLY_PERIOD_TYPES = PERIOD_TYPES.filter((type) =>
    type.startsWith('Weekly')
)
const FINANCIAL_PERIOD_TYPES = PERIOD_TYPES.filter((type) =>
    type.startsWith('Financial')
)

// The period type of each relative period category; weeks and financial years depend on a setting
const PERIOD_TYPE_BY_RELATIVE_CATEGORY = {
    DAILY: 'Daily',
    BIWEEKLY: 'BiWeekly',
    MONTHLY: 'Monthly',
    BIMONTHLY: 'BiMonthly',
    QUARTERLY: 'Quarterly',
    SIXMONTHLY: 'SixMonthly',
    YEARLY: 'Yearly',
}

/* Relative weeks and financial years follow the analyticsWeeklyStart and
 * analyticsFinancialYearStart settings. Without them, every type they could
 * be is returned. */
const getRelativePeriodTypes = (category, options) => {
    if (category === 'WEEKLY') {
        return options.weeklyPeriodType
            ? [options.weeklyPeriodType]
            : WEEKLY_PERIOD_TYPES
    }

    if (category === 'FINANCIAL') {
        return options.financialYearPeriodType
            ? [options.financialYearPeriodType]
            : FINANCIAL_PERIOD_TYPES
    }

    const periodType = PERIOD_TYPE_BY_RELATIVE_CATEGORY[category]

    return periodType ? [periodType] : []
}

/**
 * The period types a period can be: one for a fixed period or a period type,
 * several for a relative period whose type depends on a server setting, none
 * when it isn't recognized.
 */
export const getCandidatePeriodTypes = (period, options = {}) => {
    if (isPeriodType(period)) {
        return [period]
    }

    const fixedPeriodType = getPeriodTypeOfPeriodId(period)

    if (fixedPeriodType) {
        return [fixedPeriodType]
    }

    const category = getRelativePeriodShape(period)?.type

    return category ? getRelativePeriodTypes(category, options) : []
}

// The options getCandidatePeriodTypes needs, from the two server settings
export const getRelativePeriodTypeOptions = ({
    analyticsWeeklyStart,
    analyticsFinancialYearStart,
} = {}) => ({
    weeklyPeriodType: WEEKLY_START_TO_PERIOD_TYPE[analyticsWeeklyStart],
    financialYearPeriodType:
        FINANCIAL_YEAR_START_TO_PERIOD_TYPE[analyticsFinancialYearStart],
})
