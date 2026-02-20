// Mapping from server period type names to multi-calendar-dates constants
export const SERVER_PT_TO_MULTI_CALENDAR_PT = {
    Daily: 'DAILY',
    Weekly: 'WEEKLY',
    WeeklyMonday: 'WEEKLYMON',
    WeeklyTuesday: 'WEEKLYTUE',
    WeeklyWednesday: 'WEEKLYWED',
    WeeklyThursday: 'WEEKLYTHU',
    WeeklyFriday: 'WEEKLYFRI',
    WeeklySaturday: 'WEEKLYSAT',
    WeeklySunday: 'WEEKLYSUN',
    BiWeekly: 'BIWEEKLY',
    Monthly: 'MONTHLY',
    BiMonthly: 'BIMONTHLY',
    Quarterly: 'QUARTERLY',
    QuarterlyJan: 'QUARTERLYJAN',
    QuarterlyFeb: 'QUARTERLYFEB',
    QuarterlyMar: 'QUARTERLYMAR',
    QuarterlyApr: 'QUARTERLYAPR',
    QuarterlyMay: 'QUARTERLYMAY',
    QuarterlyJun: 'QUARTERLYJUN',
    QuarterlyJul: 'QUARTERLYJUL',
    QuarterlyAug: 'QUARTERLYAUG',
    QuarterlySep: 'QUARTERLYSEP',
    QuarterlyOct: 'QUARTERLYOCT',
    QuarterlyNov: 'QUARTERLYNOV',
    QuarterlyDec: 'QUARTERLYDEC',
    SixMonthly: 'SIXMONTHLY',
    SixMonthlyJan: 'SIXMONTHLYJAN',
    SixMonthlyFeb: 'SIXMONTHLYFEB',
    SixMonthlyMar: 'SIXMONTHLYMAR',
    SixMonthlyApril: 'SIXMONTHLYAPR',
    SixMonthlyMay: 'SIXMONTHLYMAY',
    SixMonthlyJun: 'SIXMONTHLYJUN',
    SixMonthlyJul: 'SIXMONTHLYJUL',
    SixMonthlyAug: 'SIXMONTHLYAUG',
    SixMonthlySep: 'SIXMONTHLYSEP',
    SixMonthlyOct: 'SIXMONTHLYOCT',
    SixMonthlyNov: 'SIXMONTHLYNOV',
    SixMonthlyDec: 'SIXMONTHLYDEC',
    Yearly: 'YEARLY',
    FinancialJan: 'FYJAN',
    FinancialFeb: 'FYFEB',
    FinancialMar: 'FYMAR',
    FinancialApril: 'FYAPR',
    FinancialMay: 'FYMAY',
    FinancialJun: 'FYJUN',
    FinancialJuly: 'FYJUL',
    FinancialAug: 'FYAUG',
    FinancialSep: 'FYSEP',
    FinancialOct: 'FYOCT',
    FinancialNov: 'FYNOV',
    FinancialDec: 'FYDEC',
}

// Mapping from relative period categories to their corresponding fixed period types
export const RP_CATEGORY_TO_FP_DEPENDENCIES = {
    DAILY: ['Daily'],
    WEEKLY: [
        'Weekly',
        'WeeklyMonday',
        'WeeklyTuesday',
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
        'QuarterlyJan',
        'QuarterlyFeb',
        'QuarterlyMar',
        'QuarterlyApr',
        'QuarterlyMay',
        'QuarterlyJun',
        'QuarterlyJul',
        'QuarterlyAug',
        'QuarterlySep',
        'QuarterlyOct',
        'QuarterlyNov',
        'QuarterlyDec',
    ],
    SIXMONTHLY: [
        'SixMonthly',
        'SixMonthlyJan',
        'SixMonthlyFeb',
        'SixMonthlyMar',
        'SixMonthlyApril',
        'SixMonthlyMay',
        'SixMonthlyJun',
        'SixMonthlyJul',
        'SixMonthlyAug',
        'SixMonthlySep',
        'SixMonthlyOct',
        'SixMonthlyNov',
        'SixMonthlyDec',
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

