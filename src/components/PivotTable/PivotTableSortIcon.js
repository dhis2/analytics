import React from 'react'
import PropTypes from 'prop-types'
import { usePivotTableEngine } from './PivotTableEngineContext'
import { SORT_ORDER_ASCENDING } from '../../modules/pivotTable/PivotTableEngine'
import { sortIcon as sortIconStyle } from './styles/PivotTable.style'
import { SortIconAscending } from './icons/SortIconAscending'
import { SortIconDescending } from './icons/SortIconDescending'
import { SortIconIdle } from './icons/SortIconIdle'

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
