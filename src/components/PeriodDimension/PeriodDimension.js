import React from 'react'
import PropTypes from 'prop-types'

import PeriodTransfer from './PeriodTransfer'
import { DIMENSION_ID_PERIOD } from '../../modules/predefinedDimensions'

export const PeriodDimension = ({
    onSelect,
    selectedPeriods,
    rightFooter,
    excludedPeriodTypes,
}) => {
    const selectPeriods = periods => {
        onSelect({
            dimensionId: DIMENSION_ID_PERIOD,
            items: periods,
        })
    }
    return (
        <PeriodTransfer
            onSelect={selectPeriods}
            initialSelectedPeriods={selectedPeriods}
            rightFooter={rightFooter}
            dataTest={'period-dimension'}
            excludedPeriodTypes={excludedPeriodTypes}
        />
    )
}

PeriodDimension.propTypes = {
    onSelect: PropTypes.func.isRequired,
    excludedPeriodTypes: PropTypes.arrayOf(PropTypes.string),
    rightFooter: PropTypes.node,
    selectedPeriods: PropTypes.array,
}

PeriodDimension.defaultProps = {
    selectedPeriods: [],
}

export default PeriodDimension
