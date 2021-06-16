import PropTypes from 'prop-types'
import React from 'react'
import { DIMENSION_ID_PERIOD } from '../../modules/predefinedDimensions'
import PeriodTransfer from './PeriodTransfer'

const PeriodDimension = ({
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
