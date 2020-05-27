import React from 'react'
import PropTypes from 'prop-types'

import PeriodSelector from './PeriodSelector'
import { DIMENSION_ID_PERIOD } from '../../modules/predefinedDimensions'

export const PeriodDimension = ({ onSelect, selectedPeriods, rightFooter }) => {
    const selectPeriods = periods => {
        const formattedPeriods = periods.map(period => ({
            id: period.value,
            name: period.label,
        }))
        onSelect({
            dimensionId: DIMENSION_ID_PERIOD,
            items: formattedPeriods,
        })
    }

    return (
        <PeriodSelector
            onSelect={selectPeriods}
            initialSelectedPeriods={selectedPeriods}
            rightFooter={rightFooter}
        />
    )
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
