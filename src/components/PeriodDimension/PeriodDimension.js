import React from 'react'
import PropTypes from 'prop-types'

import PeriodTransfer from './PeriodTransfer'
import { DIMENSION_ID_PERIOD } from '../../modules/predefinedDimensions'

import { useDataQuery } from '@dhis2/app-runtime'

const systemSettingsQuery = {
    systemSettings: {
        resource: 'systemSettings',
        params: {
            key: [
                'keyHideDailyPeriods',
                'keyHideWeeklyPeriods',
                'keyHideBiWeeklyPeriods',
                'keyHideMonthlyPeriods',
                'keyHideBiMonthlyPeriods',
            ],
        },
    },
}

export const PeriodDimension = ({ onSelect, selectedPeriods, rightFooter }) => {
    const { loading, error, data } = useDataQuery(systemSettingsQuery)

    const selectPeriods = periods => {
        onSelect({
            dimensionId: DIMENSION_ID_PERIOD,
            items: periods,
        })
    }
    if (error) {
        return <div>Add error handling here...</div>
    } else if (loading) {
        return <div>Add a loading spinner here...</div>
    } else if (data) {
        return (
            <PeriodTransfer
                onSelect={selectPeriods}
                initialSelectedPeriods={selectedPeriods}
                rightFooter={rightFooter}
                dataTest={'period-dimension'}
                settings={data.systemSettings}
            />
        )
    }
}

PeriodDimension.propTypes = {
    onSelect: PropTypes.func.isRequired,
    rightFooter: PropTypes.node,
    selectedPeriods: PropTypes.array,
}

PeriodDimension.defaultProps = {
    selectedPeriods: [],
}

export default PeriodDimension
