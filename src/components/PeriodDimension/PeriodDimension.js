import { useConfig, useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { DIMENSION_ID_PERIOD } from '../../modules/predefinedDimensions.js'
import PeriodTransfer from './PeriodTransfer.js'

const userSettingsQuery = {
    userSettings: {
        resource: 'userSettings',
        params: {
            key: ['keyUiLocale'],
        },
    },
}

const enabledPeriodTypesQuery = {
    enabledPeriodTypes: {
        resource: 'configuration/dataOutputPeriodTypes',
    },
}

const financialYearStartQuery = {
    financialYearStart: {
        resource: 'systemSettings/analyticsFinancialYearStart',
    },
}

const analysisRelativePeriodQuery = {
    analysisRelativePeriod: {
        resource: 'systemSettings/keyAnalysisRelativePeriod',
    },
}

const SELECTED_PERIODS_PROP_DEFAULT = []

const PeriodDimension = ({
    onSelect,
    selectedPeriods = SELECTED_PERIODS_PROP_DEFAULT,
    rightFooter,
    excludedPeriodTypes,
    infoBoxMessage,
    height,
}) => {
    const config = useConfig()
    const { systemInfo, serverVersion } = config
    const userSettingsResult = useDataQuery(userSettingsQuery)

    const supportsEnabledPeriodTypes = serverVersion.minor >= 43

    // Conditionally fetch enabled period types for v43+
    const enabledPeriodTypesResult = useDataQuery(
        supportsEnabledPeriodTypes ? enabledPeriodTypesQuery : { skip: true }
    )

    // Conditionally fetch financial year start setting for v43+
    const financialYearStartResult = useDataQuery(
        supportsEnabledPeriodTypes ? financialYearStartQuery : { skip: true }
    )

    // Conditionally fetch analysis relative period setting for v43+
    const analysisRelativePeriodResult = useDataQuery(
        supportsEnabledPeriodTypes
            ? analysisRelativePeriodQuery
            : { skip: true }
    )

    const { calendar = 'gregory' } = systemInfo
    const { data: { userSettings: { keyUiLocale: locale } = {} } = {} } =
        userSettingsResult

    const periodsSettings = { calendar, locale }

    // Process enabled period types and validate financial year setting
    const enabledPeriodTypesData = useMemo(() => {
        if (!supportsEnabledPeriodTypes) {
            return null
        }

        const { data: enabledTypesData, error: enabledTypesError } =
            enabledPeriodTypesResult
        const { data: fyStartData, error: fyStartError } =
            financialYearStartResult
        const { data: analysisRpData, error: analysisRpError } =
            analysisRelativePeriodResult

        if (enabledTypesError || fyStartError || analysisRpError) {
            return null
        }

        if (!enabledTypesData?.enabledPeriodTypes) {
            return null
        }

        const enabledTypes = enabledTypesData.enabledPeriodTypes

        // Handle empty enabled types
        if (!enabledTypes || enabledTypes.length === 0) {
            alert(
                'No period types are enabled in the system. Please contact your system administrator.'
            )
            return {
                enabledTypes: [],
                financialYearStart: null,
                analysisRelativePeriod: null,
            }
        }

        // Process financial year start setting
        let financialYearStart = null
        if (fyStartData?.financialYearStart?.analyticsFinancialYearStart) {
            const fyStartValue =
                fyStartData.financialYearStart.analyticsFinancialYearStart

            // Map system setting to server PT name
            const FY_SETTING_TO_SERVER_PT = {
                FINANCIAL_YEAR_APRIL: 'FinancialApril',
                FINANCIAL_YEAR_JULY: 'FinancialJuly',
                FINANCIAL_YEAR_SEPTEMBER: 'FinancialSep',
                FINANCIAL_YEAR_OCTOBER: 'FinancialOct',
                FINANCIAL_YEAR_NOVEMBER: 'FinancialNov',
            }

            const mappedFyPt = FY_SETTING_TO_SERVER_PT[fyStartValue]
            if (
                mappedFyPt &&
                enabledTypes.some((pt) => pt.name === mappedFyPt)
            ) {
                financialYearStart = fyStartValue
            }
        }

        // Process analysis relative period setting
        const analysisRelativePeriod =
            analysisRpData?.analysisRelativePeriod?.keyAnalysisRelativePeriod ||
            null

        return { enabledTypes, financialYearStart, analysisRelativePeriod }
    }, [
        supportsEnabledPeriodTypes,
        enabledPeriodTypesResult,
        financialYearStartResult,
        analysisRelativePeriodResult,
    ])

    const selectPeriods = (periods) => {
        onSelect({
            dimensionId: DIMENSION_ID_PERIOD,
            items: periods,
        })
    }
    return (
        <PeriodTransfer
            onSelect={selectPeriods}
            selectedItems={selectedPeriods}
            infoBoxMessage={infoBoxMessage}
            rightFooter={rightFooter}
            dataTest={'period-dimension'}
            excludedPeriodTypes={excludedPeriodTypes}
            periodsSettings={periodsSettings}
            height={height}
            enabledPeriodTypesData={enabledPeriodTypesData}
            supportsEnabledPeriodTypes={supportsEnabledPeriodTypes}
        />
    )
}

PeriodDimension.propTypes = {
    onSelect: PropTypes.func.isRequired,
    excludedPeriodTypes: PropTypes.arrayOf(PropTypes.string),
    height: PropTypes.string,
    infoBoxMessage: PropTypes.string,
    rightFooter: PropTypes.node,
    selectedPeriods: PropTypes.array,
}

export default PeriodDimension
