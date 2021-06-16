import PropTypes from 'prop-types'
import React from 'react'
import { SORT_ORDER_ASCENDING } from '../../modules/pivotTable/pivotTableConstants'
import { SortIconAscending } from './icons/SortIconAscending'
import { SortIconDescending } from './icons/SortIconDescending'
import { SortIconIdle } from './icons/SortIconIdle'
import { usePivotTableEngine } from './PivotTableEngineContext'
import { sortIcon as sortIconStyle } from './styles/PivotTable.style'

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
