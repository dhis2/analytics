import PropTypes from 'prop-types'
import React from 'react'
import { PivotTableCell } from './PivotTableCell'
import { usePivotTableEngine } from './PivotTableEngineContext'
import { PivotTableHeaderCell } from './PivotTableHeaderCell'
import { PivotTableSortIcon } from './PivotTableSortIcon'
import { cell as cellStyle } from './styles/PivotTable.style'

export const PivotTableColumnHeaderCell = ({
    clippingResult,
    index,
    level,
    onSortByColumn,
    sortBy,
}) => {
    const engine = usePivotTableEngine()

    const width = engine.adaptiveClippingController.columns.sizes[engine.columnMap[index]]?.size
    const height = engine.adaptiveClippingController.rows.headerSizes[level]

    return (
        <PivotTableHeaderCell
            axisClippingResult={clippingResult.columns}
            index={index}
            level={level}
            getHeader={idx => engine.getColumnHeader(idx)}
            showHierarchy={engine.visualization.showHierarchy}
            render={header => {
                const isSortable =
                    level === engine.columnDepth - 1 &&
                    header.span === 1 &&
                    engine.isSortable(index)

                return (
                    <PivotTableCell
                        isColumnHeader
                        classes={
                            header.label &&
                            header.label !== 'Total' &&
                            header.label !== 'Subtotal' // TODO: Actually look up the column type!
                                ? 'column-header'
                                : 'empty-header'
                        }
                        colSpan={header.span}
                        title={header.label}
                        style={{
                            cursor: isSortable ? 'pointer' : 'default',
                            width,
                            height,
                            whiteSpace: level === engine.columnDepth - 1 ? 'pre-line' : 'nowrap'
                        }}
                        onClick={
                            isSortable ? () => onSortByColumn(index) : undefined
                        }
                    >
                        <style jsx>{cellStyle}</style>
                        <div className="column-header-inner">
                            <span
                                className="column-header-label"
                                data-test="visualization-column-header"
                            >
                                {header.label}
                            </span>
                            {isSortable ? (
                                <PivotTableSortIcon
                                    index={index}
                                    sortBy={sortBy}
                                />
                            ) : null}
                        </div>
                    </PivotTableCell>
                )
            }}
        />
    )
}

PivotTableColumnHeaderCell.propTypes = {
    clippingResult: PropTypes.shape({ columns: PropTypes.object.isRequired })
        .isRequired,
    index: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    onSortByColumn: PropTypes.func.isRequired,
    sortBy: PropTypes.shape({
        column: PropTypes.number.isRequired,
        order: PropTypes.number.isRequired,
    }),
}
