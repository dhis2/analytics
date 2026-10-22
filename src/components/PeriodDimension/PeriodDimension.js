import { useConfig, useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { TRANSFER_HEIGHT } from '../../modules/dimensionSelectorHelper.js'
import { DIMENSION_ID_PERIOD } from '../../modules/predefinedDimensions.js'
import PeriodTransfer from './PeriodTransfer.js'
import { useDataOutputPeriodTypes } from './useDataOutputPeriodTypes.js'
import { applyPeriodNameOverrides } from './utils/enabledPeriodTypes.js'

const userSettingsQuery = {
    userSettings: {
        resource: 'userSettings',
        params: {
            key: ['keyUiLocale'],
        },
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
    const { systemInfo } = config
    const userSettingsResult = useDataQuery(userSettingsQuery)

    const { enabledPeriodTypesData, loading } = useDataOutputPeriodTypes()

    const { calendar = 'gregory' } = systemInfo
    const { data: { userSettings: { keyUiLocale: locale } = {} } = {} } =
        userSettingsResult

    const periodsSettings = { calendar, locale }

    const selectPeriods = (periods) => {
        onSelect({
            dimensionId: DIMENSION_ID_PERIOD,
            items: periods,
        })
    }

    const selectedPeriodsWithCustomDisplayNames = applyPeriodNameOverrides(
        selectedPeriods,
        enabledPeriodTypesData?.metaData
    )

    // wait for the enabled period types, otherwise the transfer briefly shows
    // the full client lists and picks its default period type from them
    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: height || TRANSFER_HEIGHT,
                }}
                data-test="period-dimension-loader"
            >
                <CircularLoader small />
            </div>
        )
    }

    return (
        <PeriodTransfer
            onSelect={selectPeriods}
            selectedItems={selectedPeriodsWithCustomDisplayNames}
            infoBoxMessage={infoBoxMessage}
            rightFooter={rightFooter}
            dataTest={'period-dimension'}
            excludedPeriodTypes={excludedPeriodTypes}
            periodsSettings={periodsSettings}
            height={height}
            enabledPeriodTypesData={enabledPeriodTypesData}
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
