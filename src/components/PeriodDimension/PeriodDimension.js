import { useConfig, useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo } from 'react'
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

const v43Query = {
    enabledPeriodTypes: {
        resource: 'configuration/dataOutputPeriodTypes',
    },
    financialYearStart: {
        resource: 'systemSettings/analyticsFinancialYearStart',
    },
    analysisRelativePeriod: {
        resource: 'systemSettings/keyAnalysisRelativePeriod',
    },
}

const FY_SETTING_TO_SERVER_PT = {
    FINANCIAL_YEAR_APRIL: 'FinancialApril',
    FINANCIAL_YEAR_JULY: 'FinancialJuly',
    FINANCIAL_YEAR_SEPTEMBER: 'FinancialSep',
    FINANCIAL_YEAR_OCTOBER: 'FinancialOct',
    FINANCIAL_YEAR_NOVEMBER: 'FinancialNov',
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

    const { calendar = 'gregory' } = systemInfo
    const { data: { userSettings: { keyUiLocale: locale } = {} } = {} } =
        userSettingsResult

    const periodsSettings = { calendar, locale }

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

        let financialYearStart = null
        if (v43Data.financialYearStart?.analyticsFinancialYearStart) {
            const fyStartValue =
                v43Data.financialYearStart.analyticsFinancialYearStart

            const mappedFyPt = FY_SETTING_TO_SERVER_PT[fyStartValue]
            if (
                mappedFyPt &&
                enabledTypes.some((pt) => pt.name === mappedFyPt)
            ) {
                financialYearStart = fyStartValue
            }
        }

        const analysisRelativePeriod =
            v43Data.analysisRelativePeriod?.keyAnalysisRelativePeriod || null

        return {
            enabledTypes,
            financialYearStart,
            analysisRelativePeriod,
            noEnabledTypes: false,
        }
    }, [supportsEnabledPeriodTypes, v43Data, v43Error])

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
