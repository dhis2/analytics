import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { PivotTableHeaderCell } from './PivotTableHeaderCell'
import { cell as cellStyle } from './styles/PivotTable.style'
import { SORT_ORDER_ASCENDING } from '../../modules/pivotTable/PivotTableEngine'

import { SortIconAscending } from './icons/SortIconAscending'
import { SortIconDescending } from './icons/SortIconDescending'
import { SortIconIdle } from './icons/SortIconIdle'

export const PivotTableColumnHeaderCell = ({
    engine,
    clippingResult,
    index,
    level,
    onSortByColumn,
    sortBy,
}) => (
    <PivotTableHeaderCell
        axisClippingResult={clippingResult.columns}
        index={index}
        level={level}
        getHeader={idx => engine.getColumnHeader(idx)}
        showHierarchy={engine.visualization.showHierarchy}
        render={header => {
            const isSortable =
                level === engine.dimensionLookup.columns.length - 1 &&
                header.span === 1 &&
                engine.isSortable(index)

            const SortIcon =
                isSortable &&
                (sortBy?.column === index
                    ? sortBy.order === SORT_ORDER_ASCENDING
                        ? SortIconAscending
                        : SortIconDescending
                    : SortIconIdle)
            return (
                <th
                    className={classnames(
                        header.label &&
                            header.label !== 'Total' &&
                            header.label !== 'Subtotal' // TODO: Actually look up the column type!
                            ? 'column-header'
                            : 'empty-header',
                        `fontsize-${engine.visualization.fontSize}`,
                        `displaydensity-${engine.visualization.displayDensity}`
                    )}
                    colSpan={header.span}
                    title={header.label}
                    style={{ cursor: isSortable ? 'pointer' : 'default' }}
                    onClick={
                        isSortable ? () => onSortByColumn(index) : undefined
                    }
                >
                    <style jsx>{cellStyle}</style>
                    <div className="column-header-inner">
                        {header.label}
                        {isSortable ? (
                            <span className="sort-icon">
                                <SortIcon />
                            </span>
                        ) : null}
                    </div>
                </th>
            )
        }}
    />
)

PivotTableColumnHeaderCell.propTypes = {
    clippingResult: PropTypes.shape({ columns: PropTypes.object.isRequired })
        .isRequired,
    engine: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    onSortByColumn: PropTypes.func.isRequired,
    sortBy: PropTypes.shape({
        column: PropTypes.number.isRequired,
        order: PropTypes.number.isRequired,
    }),
}
