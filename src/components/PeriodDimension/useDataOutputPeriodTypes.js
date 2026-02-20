import { useConfig, useDataQuery } from '@dhis2/app-runtime'
import { useEffect, useMemo } from 'react'

const v43Query = {
    enabledPeriodTypes: {
        resource: 'configuration/dataOutputPeriodTypes',
    },
    // v43-only: analyticsFinancialYearStart is removed in v44
    financialYearStart: {
        resource: 'systemSettings/analyticsFinancialYearStart',
    },
    analysisRelativePeriod: {
        resource: 'systemSettings/keyAnalysisRelativePeriod',
    },
    // v43-only: analyticsWeeklyStart is removed in v44
    weeklyStart: {
        resource: 'systemSettings/analyticsWeeklyStart',
    },
}

// v43-only: analyticsFinancialYearStart is removed in v44
const FY_SETTING_TO_SERVER_PT = {
    FINANCIAL_YEAR_APRIL: 'FinancialApril',
    FINANCIAL_YEAR_JULY: 'FinancialJuly',
    FINANCIAL_YEAR_SEPTEMBER: 'FinancialSep',
    FINANCIAL_YEAR_OCTOBER: 'FinancialOct',
    FINANCIAL_YEAR_NOVEMBER: 'FinancialNov',
}

// v43-only: analyticsWeeklyStart is removed in v44
const WEEKLY_START_TO_SERVER_PT = {
    WEEKLY: 'Weekly',
    WEEKLY_WEDNESDAY: 'WeeklyWednesday',
    WEEKLY_THURSDAY: 'WeeklyThursday',
    WEEKLY_FRIDAY: 'WeeklyFriday',
    WEEKLY_SATURDAY: 'WeeklySaturday',
    WEEKLY_SUNDAY: 'WeeklySunday',
}

const useDataOutputPeriodTypes = () => {
    const { serverVersion } = useConfig()
    const supportsEnabledPeriodTypes = serverVersion.minor >= 43

    const {
        data: v43Data,
        error: v43Error,
        refetch: v43Refetch,
    } = useDataQuery(v43Query, { lazy: true })

    useEffect(() => {
        if (supportsEnabledPeriodTypes) {
            v43Refetch()
        }
    }, [supportsEnabledPeriodTypes, v43Refetch])

    const enabledPeriodTypesData = useMemo(() => {
        if (!supportsEnabledPeriodTypes) {
            return null
        }

        if (v43Error || !v43Data?.enabledPeriodTypes) {
            return null
        }

        const enabledTypes = v43Data.enabledPeriodTypes

        if (!enabledTypes || enabledTypes.length === 0) {
            return {
                enabledTypes: [],
                financialYearStart: null,
                analysisRelativePeriod: null,
                noEnabledTypes: true,
            }
        }

        // v43-only: financial year logic goes away in v44
        let financialYearStart = null
        let financialYearDisplayLabel = null
        if (v43Data.financialYearStart?.analyticsFinancialYearStart) {
            const fyStartValue =
                v43Data.financialYearStart.analyticsFinancialYearStart

            const mappedFyPt = FY_SETTING_TO_SERVER_PT[fyStartValue]
            const matchingPt = enabledTypes.find(
                (pt) => pt.name === mappedFyPt
            )
            if (matchingPt) {
                financialYearStart = fyStartValue
                if (matchingPt.displayLabel) {
                    financialYearDisplayLabel = matchingPt.displayLabel
                }
            }
        }

        // v43-only: weekly start logic goes away in v44
        let weeklyDisplayLabel = null
        if (v43Data.weeklyStart?.analyticsWeeklyStart) {
            const weeklyStartValue =
                v43Data.weeklyStart.analyticsWeeklyStart

            const mappedWeeklyPt =
                WEEKLY_START_TO_SERVER_PT[weeklyStartValue]
            const matchingWeeklyPt = enabledTypes.find(
                (pt) => pt.name === mappedWeeklyPt
            )
            if (matchingWeeklyPt?.displayLabel) {
                weeklyDisplayLabel = matchingWeeklyPt.displayLabel
            }
        }

        const analysisRelativePeriod =
            v43Data.analysisRelativePeriod?.keyAnalysisRelativePeriod || null

        const metaData = {
            ...(financialYearDisplayLabel && {
                THIS_FINANCIAL_YEAR: {
                    name: `This ${financialYearDisplayLabel}`,
                },
                LAST_FINANCIAL_YEAR: {
                    name: `Last ${financialYearDisplayLabel}`,
                },
                LAST_5_FINANCIAL_YEARS: {
                    name: `Last 5 ${financialYearDisplayLabel}`,
                },
            }),
            ...(weeklyDisplayLabel && {
                THIS_WEEK: {
                    name: `This ${weeklyDisplayLabel}`,
                },
                LAST_WEEK: {
                    name: `Last ${weeklyDisplayLabel}`,
                },
                LAST_4_WEEKS: {
                    name: `Last 4 ${weeklyDisplayLabel}`,
                },
                LAST_12_WEEKS: {
                    name: `Last 12 ${weeklyDisplayLabel}`,
                },
                LAST_52_WEEKS: {
                    name: `Last 52 ${weeklyDisplayLabel}`,
                },
                WEEKS_THIS_YEAR: {
                    name: `${weeklyDisplayLabel} this year`,
                },
            }),
        }

        return {
            enabledTypes,
            financialYearStart,
            financialYearDisplayLabel,
            weeklyDisplayLabel,
            analysisRelativePeriod,
            metaData,
            noEnabledTypes: false,
        }
    }, [supportsEnabledPeriodTypes, v43Data, v43Error])

    return {
        supportsEnabledPeriodTypes,
        enabledPeriodTypesData,
    }
}

export { useDataOutputPeriodTypes }
