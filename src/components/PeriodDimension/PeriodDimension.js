import React from 'react'
import PropTypes from 'prop-types'

import { DIMENSION_ID_PERIOD } from '../../modules/predefinedDimensions'
import PeriodSelector from './PeriodSelector'

export const PeriodDimension = ({
    onDeselect,
    onReorder,
    onSelect,
    selectedPeriods,
}) => {
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

    const deselectItems = periods => {
        // TODO: Can this and reorderItems be removed, since its all handled by Transfer now?
        const itemIdsToRemove = periods.map(period => period.id)

        onDeselect({
            dimensionId: DIMENSION_ID_PERIOD,
            itemIdsToRemove,
        })
    }

    const reorderItems = periods => {
        const itemIds = periods.map(period => period.id)

        onReorder({
            dimensionId: DIMENSION_ID_PERIOD,
            itemIds,
        })
    }

    return (
        <PeriodSelector
            onSelect={selectItems}
            onDeselect={deselectItems}
            onReorder={reorderItems}
            selectedItems={selectedPeriods}
        />
    )
}

PeriodDimension.propTypes = {
    onDeselect: PropTypes.func.isRequired,
    onReorder: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    selectedPeriods: PropTypes.array,
}

PeriodDimension.defaultProps = {
    selectedPeriods: [],
}

export default PeriodDimension
