import React from 'react'
import PropTypes from 'prop-types'

import { DIMENSION_ID_PERIOD } from '../../modules/predefinedDimensions'
import PeriodSelector from './PeriodSelector'

export const PeriodDimension = ({ onSelect, selectedPeriods, rightFooter }) => {
    const selectItems = periods => {
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
            onSelect={selectItems}
            selectedItems={selectedPeriods}
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
