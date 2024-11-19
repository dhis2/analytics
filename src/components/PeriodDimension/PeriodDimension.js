import { useConfig, useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
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

const PeriodDimension = ({
    onSelect,
    selectedPeriods,
    rightFooter,
    excludedPeriodTypes,
    infoBoxMessage,
    height,
}) => {
    const { systemInfo } = useConfig()
    const result = useDataQuery(userSettingsQuery)

    const { calendar = 'gregory' } = systemInfo
    const { data: { userSettings: { keyUiLocale: locale } = {} } = {} } = result

    const periodsSettings = { calendar, locale }

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
        />
    )
}

PeriodDimension.propTypes = {
    onSelect: PropTypes.func.isRequired,
    excludedPeriodTypes: PropTypes.arrayOf(PropTypes.string),
    infoBoxMessage: PropTypes.string,
    rightFooter: PropTypes.node,
    selectedPeriods: PropTypes.array,
    height: PropTypes.string,
}

PeriodDimension.defaultProps = {
    selectedPeriods: [],
}

export default PeriodDimension
