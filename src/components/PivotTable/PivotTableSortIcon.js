import PropTypes from 'prop-types'
import React from 'react'
import { SORT_ORDER_ASCENDING } from '../../modules/pivotTable/pivotTableConstants.js'
import { SortIconAscending } from './icons/SortIconAscending.js'
import { SortIconDescending } from './icons/SortIconDescending.js'
import { SortIconIdle } from './icons/SortIconIdle.js'
import { usePivotTableEngine } from './PivotTableEngineContext.js'
import { sortIcon as sortIconStyle } from './styles/PivotTable.style.js'

export const PivotTableSortIcon = ({ index, sortBy }) => {
    const engine = usePivotTableEngine()

    const SortIcon =
        sortBy?.column === index
            ? sortBy.order === SORT_ORDER_ASCENDING
                ? SortIconAscending
                : SortIconDescending
            : SortIconIdle

    return (
        <span className={`fontsize-${engine.visualization.fontSize}`}>
            <style jsx>{sortIconStyle}</style>
            <SortIcon />
        </span>
    )
}

PivotTableSortIcon.propTypes = {
    index: PropTypes.number.isRequired,
    sortBy: PropTypes.object,
}
