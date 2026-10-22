// Mapping from server period type names to multi-calendar-dates constants
export const SERVER_PT_TO_MULTI_CALENDAR_PT = {
    Daily: 'DAILY',
    Weekly: 'WEEKLY',
    WeeklyWednesday: 'WEEKLYWED',
    WeeklyThursday: 'WEEKLYTHU',
    WeeklyFriday: 'WEEKLYFRI',
    WeeklySaturday: 'WEEKLYSAT',
    WeeklySunday: 'WEEKLYSUN',
    BiWeekly: 'BIWEEKLY',
    Monthly: 'MONTHLY',
    BiMonthly: 'BIMONTHLY',
    Quarterly: 'QUARTERLY',
    QuarterlyNov: 'QUARTERLYNOV',
    SixMonthly: 'SIXMONTHLY',
    SixMonthlyApril: 'SIXMONTHLYAPR',
    SixMonthlyNov: 'SIXMONTHLYNOV',
    Yearly: 'YEARLY',
    FinancialFeb: 'FYFEB',
    FinancialApril: 'FYAPR',
    FinancialJuly: 'FYJUL',
    FinancialAug: 'FYAUG',
    FinancialSep: 'FYSEP',
    FinancialOct: 'FYOCT',
    FinancialNov: 'FYNOV',
}

// Mapping from the analyticsFinancialYearStart system setting to server period type names
export const FY_SETTING_TO_SERVER_PT = {
    FINANCIAL_YEAR_FEBRUARY: 'FinancialFeb',
    FINANCIAL_YEAR_APRIL: 'FinancialApril',
    FINANCIAL_YEAR_JULY: 'FinancialJuly',
    FINANCIAL_YEAR_AUGUST: 'FinancialAug',
    FINANCIAL_YEAR_SEPTEMBER: 'FinancialSep',
    FINANCIAL_YEAR_OCTOBER: 'FinancialOct',
    FINANCIAL_YEAR_NOVEMBER: 'FinancialNov',
}

// Mapping from the analyticsWeeklyStart system setting to server period type names
export const WEEKLY_START_TO_SERVER_PT = {
    WEEKLY: 'Weekly',
    WEEKLY_WEDNESDAY: 'WeeklyWednesday',
    WEEKLY_THURSDAY: 'WeeklyThursday',
    WEEKLY_FRIDAY: 'WeeklyFriday',
    WEEKLY_SATURDAY: 'WeeklySaturday',
    WEEKLY_SUNDAY: 'WeeklySunday',
}

// Mapping from relative period categories to their corresponding fixed period types
export const RP_CATEGORY_TO_FP_DEPENDENCIES = {
    DAILY: ['Daily'],
    WEEKLY: [
        'Weekly',
        'WeeklyWednesday',
        'WeeklyThursday',
        'WeeklyFriday',
        'WeeklySaturday',
        'WeeklySunday',
    ],
    BIWEEKLY: ['BiWeekly'],
    MONTHLY: ['Monthly'],
    BIMONTHLY: ['BiMonthly'],
    QUARTERLY: ['Quarterly', 'QuarterlyNov'],
    SIXMONTHLY: ['SixMonthly', 'SixMonthlyApril', 'SixMonthlyNov'],
    YEARLY: ['Yearly'],
}

/**
 * Filter fixed period types based on enabled server period types
 * @param {Array} allFixedPeriodOptions - All available fixed period options
 * @param {Array} enabledServerPeriodTypes - Enabled period types from server
 * @returns {Array} Filtered fixed period options
 */
export const filterEnabledFixedPeriodTypes = (
    allFixedPeriodOptions,
    enabledServerPeriodTypes
) => {
    if (!enabledServerPeriodTypes || enabledServerPeriodTypes.length === 0) {
        return []
    }

    const enabledServerPtNames = new Set(
        enabledServerPeriodTypes.map((pt) => pt.name)
    )
    const enabledMultiCalendarPts = new Set()

    // Map server PT names to multi-calendar-dates constants
    enabledServerPtNames.forEach((serverPtName) => {
        const multiCalendarPt = SERVER_PT_TO_MULTI_CALENDAR_PT[serverPtName]
        if (multiCalendarPt) {
            enabledMultiCalendarPts.add(multiCalendarPt)
        }
    })

    // Filter fixed period options to only include enabled ones
    return allFixedPeriodOptions.filter((option) =>
        enabledMultiCalendarPts.has(option.id)
    )
}

/**
 * Apply metaData name overrides to a list of periods
 */
export const applyPeriodNameOverrides = (periods, metaData) => {
    if (!metaData) {
        return periods
    }
    return periods.map((period) =>
        metaData[period.id]
            ? { ...period, name: metaData[period.id].name }
            : period
    )
}
