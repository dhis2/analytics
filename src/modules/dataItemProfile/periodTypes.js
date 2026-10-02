import { SERVER_PT_TO_MULTI_CALENDAR_PT } from '../../components/PeriodDimension/utils/enabledPeriodTypes.js'
import { PERIOD_TYPE_REGEX } from '../../components/PeriodDimension/utils/fixedPeriods.js'
import { getRelativePeriodsDetails } from '../../components/PeriodDimension/utils/relativePeriods.js'

// Server period type names with their frequencyOrder, as /api/periodTypes returns them
export const PERIOD_TYPE_FREQUENCY_ORDER = {
    Daily: 1,
    Weekly: 7,
    WeeklyWednesday: 7,
    WeeklyThursday: 7,
    WeeklyFriday: 7,
    WeeklySaturday: 7,
    WeeklySunday: 7,
    BiWeekly: 14,
    Monthly: 30,
    BiMonthly: 61,
    Quarterly: 91,
    QuarterlyNov: 91,
    SixMonthly: 182,
    SixMonthlyApril: 182,
    SixMonthlyNov: 182,
    Yearly: 365,
    FinancialFeb: 365,
    FinancialApril: 365,
    FinancialJuly: 365,
    FinancialAug: 365,
    FinancialSep: 365,
    FinancialOct: 365,
    FinancialNov: 365,
    TwoYearly: 730,
}

export const PERIOD_TYPES = Object.keys(PERIOD_TYPE_FREQUENCY_ORDER)

/* Analytics fails on QuarterlyNov periods in 2.40 ("Can't find resource for
 * bundle … key format.QuarterlyNov.startDate"), and answers from 2.41 */
const PERIOD_TYPE_MIN_MINOR_VERSION = { QuarterlyNov: 41 }

// Without a server version, every type counts as supported
export const isPeriodTypeSupported = (periodType, serverVersion) =>
    !serverVersion ||
    serverVersion.major > 2 ||
    serverVersion.minor >= (PERIOD_TYPE_MIN_MINOR_VERSION[periodType] ?? 0)

const WEEKLY_PERIOD_TYPES = PERIOD_TYPES.filter((type) =>
    type.startsWith('Weekly')
)
const FINANCIAL_PERIOD_TYPES = PERIOD_TYPES.filter((type) =>
    type.startsWith('Financial')
)

export const isPeriodType = (value) =>
    Object.prototype.hasOwnProperty.call(PERIOD_TYPE_FREQUENCY_ORDER, value)

export const getFrequencyOrder = (periodType) =>
    PERIOD_TYPE_FREQUENCY_ORDER[periodType]

export const sortPeriodTypes = (periodTypes) =>
    [...periodTypes].sort(
        (a, b) =>
            getFrequencyOrder(a) - getFrequencyOrder(b) ||
            PERIOD_TYPES.indexOf(a) - PERIOD_TYPES.indexOf(b)
    )

const SERVER_PT_BY_LIBRARY_PT = Object.fromEntries(
    Object.entries(SERVER_PT_TO_MULTI_CALENDAR_PT).map(([server, library]) => [
        library,
        server,
    ])
)

// PERIOD_TYPE_REGEX lacks the November quarters and six-months
const PERIOD_ID_PATTERNS = [
    ...Object.entries(PERIOD_TYPE_REGEX).map(([libraryType, regex]) => [
        SERVER_PT_BY_LIBRARY_PT[libraryType],
        regex,
    ]),
    ['QuarterlyNov', /^(\d{4})NovQ([1-4])$/],
    ['SixMonthlyNov', /^(\d{4})NovS([12])$/],
]

export const getPeriodTypeOfPeriodId = (periodId) =>
    PERIOD_ID_PATTERNS.find(([, regex]) => regex.test(periodId))?.[0] ?? null

const RELATIVE_CATEGORY_PERIOD_TYPES = {
    DAILY: ['Daily'],
    BIWEEKLY: ['BiWeekly'],
    MONTHLY: ['Monthly'],
    BIMONTHLY: ['BiMonthly'],
    QUARTERLY: ['Quarterly'],
    SIXMONTHLY: ['SixMonthly'],
    YEARLY: ['Yearly'],
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

    return RELATIVE_CATEGORY_PERIOD_TYPES[category] ?? []
}

const getRelativePeriodCategory = (periodId) =>
    getRelativePeriodsDetails()[periodId]?.type

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

    const category = getRelativePeriodCategory(period)

    return category ? getRelativePeriodTypes(category, options) : []
}

const WEEKLY_START_TO_PERIOD_TYPE = {
    WEEKLY: 'Weekly',
    WEEKLY_WEDNESDAY: 'WeeklyWednesday',
    WEEKLY_THURSDAY: 'WeeklyThursday',
    WEEKLY_FRIDAY: 'WeeklyFriday',
    WEEKLY_SATURDAY: 'WeeklySaturday',
    WEEKLY_SUNDAY: 'WeeklySunday',
}

const FINANCIAL_YEAR_START_TO_PERIOD_TYPE = {
    FINANCIAL_YEAR_FEBRUARY: 'FinancialFeb',
    FINANCIAL_YEAR_APRIL: 'FinancialApril',
    FINANCIAL_YEAR_JULY: 'FinancialJuly',
    FINANCIAL_YEAR_AUGUST: 'FinancialAug',
    FINANCIAL_YEAR_SEPTEMBER: 'FinancialSep',
    FINANCIAL_YEAR_OCTOBER: 'FinancialOct',
    FINANCIAL_YEAR_NOVEMBER: 'FinancialNov',
}

export const getRelativePeriodTypeOptions = ({
    analyticsWeeklyStart,
    analyticsFinancialYearStart,
} = {}) => ({
    weeklyPeriodType: WEEKLY_START_TO_PERIOD_TYPE[analyticsWeeklyStart],
    financialYearPeriodType:
        FINANCIAL_YEAR_START_TO_PERIOD_TYPE[analyticsFinancialYearStart],
})
