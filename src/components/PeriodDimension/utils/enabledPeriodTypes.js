// Mapping from server period type names to multi-calendar-dates constants
export const SERVER_PT_TO_MULTI_CALENDAR_PT = {
    Daily: 'DAILY',
    Weekly: 'WEEKLY',
    WeeklyWednesday: 'WEEKLYWED',
    WeeklyThursday: 'WEEKLYTHU',
    WeeklySaturday: 'WEEKLYSAT',
    WeeklySunday: 'WEEKLYSUN',
    BiWeekly: 'BIWEEKLY',
    Monthly: 'MONTHLY',
    BiMonthly: 'BIMONTHLY',
    Quarterly: 'QUARTERLY',
    SixMonthly: 'SIXMONTHLY',
    SixMonthlyApril: 'SIXMONTHLYAPR',
    Yearly: 'YEARLY',
    FinancialApril: 'FYAPR',
    FinancialJuly: 'FYJUL',
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
        'WeeklySaturday',
        'WeeklySunday',
    ],
    BIWEEKLY: ['BiWeekly'],
    MONTHLY: ['Monthly'],
    BIMONTHLY: ['BiMonthly'],
    QUARTERLY: ['Quarterly'],
    SIXMONTHLY: ['SixMonthly', 'SixMonthlyApril'],
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

    const enabledServerPtNames = enabledServerPeriodTypes.map((pt) => pt.name)
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
export const filterEnabledRelativePeriodTypes = (
    allRelativePeriodOptions,
    enabledServerPeriodTypes,
    financialYearStart = null
) => {
    if (!enabledServerPeriodTypes || enabledServerPeriodTypes.length === 0) {
        return []
    }

    const enabledServerPtNames = enabledServerPeriodTypes.map((pt) => pt.name)

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
            enabledServerPtNames.includes(fpType)
        )
    })
}

// Mapping from keyAnalysisRelativePeriod system setting values (RP IDs) to categories
export const ANALYSIS_RELATIVE_PERIOD_MAPPING = {
    THIS_WEEK: { id: 'THIS_WEEK', category: 'WEEKLY' },
    LAST_WEEK: { id: 'LAST_WEEK', category: 'WEEKLY' },
    LAST_4_WEEKS: { id: 'LAST_4_WEEKS', category: 'WEEKLY' },
    LAST_12_WEEKS: { id: 'LAST_12_WEEKS', category: 'WEEKLY' },
    LAST_52_WEEKS: { id: 'LAST_52_WEEKS', category: 'WEEKLY' },
    THIS_MONTH: { id: 'THIS_MONTH', category: 'MONTHLY' },
    LAST_MONTH: { id: 'LAST_MONTH', category: 'MONTHLY' },
    MONTHS_THIS_YEAR: { id: 'MONTHS_THIS_YEAR', category: 'MONTHLY' },
    // Note: MONTHS_LAST_YEAR does not exist in current RP definitions
    LAST_3_MONTHS: { id: 'LAST_3_MONTHS', category: 'MONTHLY' },
    LAST_6_MONTHS: { id: 'LAST_6_MONTHS', category: 'MONTHLY' },
    LAST_12_MONTHS: { id: 'LAST_12_MONTHS', category: 'MONTHLY' },
    THIS_BIMONTH: { id: 'THIS_BIMONTH', category: 'BIMONTHLY' },
    LAST_BIMONTH: { id: 'LAST_BIMONTH', category: 'BIMONTHLY' },
    LAST_6_BIMONTHS: { id: 'LAST_6_BIMONTHS', category: 'BIMONTHLY' },
    THIS_QUARTER: { id: 'THIS_QUARTER', category: 'QUARTERLY' },
    LAST_QUARTER: { id: 'LAST_QUARTER', category: 'QUARTERLY' },
    QUARTERS_THIS_YEAR: { id: 'QUARTERS_THIS_YEAR', category: 'QUARTERLY' },
    // Note: QUARTERS_LAST_YEAR does not exist in current RP definitions
    LAST_4_QUARTERS: { id: 'LAST_4_QUARTERS', category: 'QUARTERLY' },
    THIS_SIX_MONTH: { id: 'THIS_SIX_MONTH', category: 'SIXMONTHLY' },
    LAST_SIX_MONTH: { id: 'LAST_SIX_MONTH', category: 'SIXMONTHLY' },
    LAST_2_SIXMONTHS: { id: 'LAST_2_SIXMONTHS', category: 'SIXMONTHLY' },
    THIS_YEAR: { id: 'THIS_YEAR', category: 'YEARLY' },
    LAST_YEAR: { id: 'LAST_YEAR', category: 'YEARLY' },
    LAST_5_YEARS: { id: 'LAST_5_YEARS', category: 'YEARLY' },
    LAST_10_YEARS: { id: 'LAST_10_YEARS', category: 'YEARLY' },
    THIS_FINANCIAL_YEAR: { id: 'THIS_FINANCIAL_YEAR', category: 'FINANCIAL' },
    LAST_FINANCIAL_YEAR: { id: 'LAST_FINANCIAL_YEAR', category: 'FINANCIAL' },
    LAST_5_FINANCIAL_YEARS: {
        id: 'LAST_5_FINANCIAL_YEARS',
        category: 'FINANCIAL',
    },
}

// Fallback priority order for RP categories (closest to most commonly used)
const RP_CATEGORY_FALLBACK_ORDER = [
    'MONTHLY', // Most common
    'QUARTERLY', // Close alternative to monthly
    'YEARLY', // Longer term view
    'WEEKLY', // More granular
    'SIXMONTHLY', // Mid-term
    'BIMONTHLY', // Less common
    'FINANCIAL', // Depends on system config
    'BIWEEKLY', // Least common
    'DAILY', // Very granular
]

/**
 * Find the best available relative period based on keyAnalysisRelativePeriod setting
 * @param {Array} enabledRelativeOptions - Available RP categories
 * @param {string|null} analysisRelativePeriod - System setting value
 * @returns {Object} { categoryId, periodId } or null
 */
export const findBestAvailableRelativePeriod = (
    enabledRelativeOptions,
    analysisRelativePeriod
) => {
    if (!enabledRelativeOptions || enabledRelativeOptions.length === 0) {
        return null
    }

    const enabledCategoryIds = new Set(
        enabledRelativeOptions.map((opt) => opt.id)
    )

    // Try to use the configured analysis relative period first
    if (
        analysisRelativePeriod &&
        ANALYSIS_RELATIVE_PERIOD_MAPPING[analysisRelativePeriod]
    ) {
        const { id: periodId, category: categoryId } =
            ANALYSIS_RELATIVE_PERIOD_MAPPING[analysisRelativePeriod]

        if (enabledCategoryIds.has(categoryId)) {
            return { categoryId, periodId }
        }
    }

    // Fall back to the highest priority enabled category
    for (const categoryId of RP_CATEGORY_FALLBACK_ORDER) {
        if (enabledCategoryIds.has(categoryId)) {
            // Use the first period from that category as default
            const categoryOption = enabledRelativeOptions.find(
                (opt) => opt.id === categoryId
            )
            const periods = categoryOption?.getPeriods() || []
            const defaultPeriod = periods[0]

            return {
                categoryId,
                periodId: defaultPeriod?.id || null,
            }
        }
    }

    // Last resort: use first available category and its first period
    const firstCategory = enabledRelativeOptions[0]
    const firstPeriod = firstCategory?.getPeriods()?.[0]

    return {
        categoryId: firstCategory?.id || null,
        periodId: firstPeriod?.id || null,
    }
}
