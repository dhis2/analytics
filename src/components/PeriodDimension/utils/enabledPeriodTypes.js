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
    QUARTERLY: [
        'Quarterly',
        'QuarterlyNov',
    ],
    SIXMONTHLY: [
        'SixMonthly',
        'SixMonthlyApril',
        'SixMonthlyNov',
    ],
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
 * Filter relative period categories based on enabled server period types
 * @param {Array} allRelativePeriodOptions - All available relative period options
 * @param {Array} enabledServerPeriodTypes - Enabled period types from server
 * @param {string|null} financialYearStart - Financial year start setting (if enabled)
 * @returns {Array} Filtered relative period options
 */
/**
 * Apply metaData name overrides to a list of periods
 * v43-only: in v44 the API provides these names directly
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

/**
 * Apply display label overrides to relative period options
 * v43-only: in v44 the API provides these names directly
 */
export const applyDisplayLabelOverrides = (
    filteredRelativeOptions,
    { financialYearDisplayLabel, weeklyDisplayLabel, metaData }
) => {
    const overrides = {}

    if (financialYearDisplayLabel) {
        overrides['FINANCIAL'] = { name: financialYearDisplayLabel }
    }
    if (weeklyDisplayLabel) {
        overrides['WEEKLY'] = { name: weeklyDisplayLabel }
    }

    if (Object.keys(overrides).length === 0) {
        return filteredRelativeOptions
    }

    return filteredRelativeOptions.map((option) => {
        const override = overrides[option.id]
        if (!override) {
            return option
        }
        return {
            ...option,
            name: override.name,
            getPeriods: () =>
                applyPeriodNameOverrides(option.getPeriods(), metaData),
        }
    })
}

export const filterEnabledRelativePeriodTypes = (
    allRelativePeriodOptions,
    enabledServerPeriodTypes,
    financialYearStart = null
) => {
    if (!enabledServerPeriodTypes || enabledServerPeriodTypes.length === 0) {
        return []
    }

    const enabledServerPtNames = new Set(
        enabledServerPeriodTypes.map((pt) => pt.name)
    )

    return allRelativePeriodOptions.filter((option) => {
        // Special handling for financial years
        if (option.id === 'FINANCIAL') {
            return financialYearStart !== null
        }

        // Check if any of the required FP dependencies are enabled
        const requiredFpTypes = RP_CATEGORY_TO_FP_DEPENDENCIES[option.id]
        if (!requiredFpTypes) {
            return true // Show if no dependency mapping (shouldn't happen)
        }

        return requiredFpTypes.some((fpType) =>
            enabledServerPtNames.has(fpType)
        )
    })
}

