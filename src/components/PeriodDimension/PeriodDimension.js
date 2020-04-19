import React from 'react'
import PropTypes from 'prop-types'
import uniqBy from 'lodash/uniqBy'
import PeriodSelector from './PeriodSelector/PeriodSelector'

import { DIMENSION_ID_PERIOD } from '../../modules/predefinedDimensions'

export const PeriodDimension = ({
    onDeselect,
    onReorder,
    onSelect,
    selectedPeriods,
}) => {
    const selectItems = periods => {
        const newItems = periods.map(period => ({
            id: period.id,
            name: period.name,
        }))
        const alreadySelected = selectedPeriods.map(period => ({
            id: period.id,
            name: period.name,
        }))

        onSelect({
            dimensionId: DIMENSION_ID_PERIOD,
            items: uniqBy(alreadySelected.concat(newItems), 'id'),
        })
    }

    const deselectItems = periods => {
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
