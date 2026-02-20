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
}

// v43-only: analyticsFinancialYearStart is removed in v44
const FY_SETTING_TO_SERVER_PT = {
    FINANCIAL_YEAR_APRIL: 'FinancialApril',
    FINANCIAL_YEAR_JULY: 'FinancialJuly',
    FINANCIAL_YEAR_SEPTEMBER: 'FinancialSep',
    FINANCIAL_YEAR_OCTOBER: 'FinancialOct',
    FINANCIAL_YEAR_NOVEMBER: 'FinancialNov',
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

        const analysisRelativePeriod =
            v43Data.analysisRelativePeriod?.keyAnalysisRelativePeriod || null

        const metaData = financialYearDisplayLabel
            ? {
                THIS_FINANCIAL_YEAR: {
                    name: `This ${financialYearDisplayLabel}`,
                },
                LAST_FINANCIAL_YEAR: {
                    name: `Last ${financialYearDisplayLabel}`,
                },
                LAST_5_FINANCIAL_YEARS: {
                    name: `Last 5 ${financialYearDisplayLabel}`,
                },
            }
            : null

        return {
            enabledTypes,
            financialYearStart,
            financialYearDisplayLabel,
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
