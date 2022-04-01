import PropTypes from 'prop-types'
import React from 'react'
import { PivotTableCell } from './PivotTableCell.js'
import { usePivotTableEngine } from './PivotTableEngineContext.js'
import { PivotTableHeaderCell } from './PivotTableHeaderCell.js'
import { PivotTableSortIcon } from './PivotTableSortIcon.js'
import { cell as cellStyle } from './styles/PivotTable.style.js'

export const PivotTableColumnHeaderCell = ({
    clippingResult,
    index,
    level,
    onSortByColumn,
    sortBy,
}) => {
    const engine = usePivotTableEngine()

    const width =
        engine.adaptiveClippingController.columns.sizes[engine.columnMap[index]]
            ?.size
    const height = engine.adaptiveClippingController.rows.headerSizes[level]

    return (
        <PivotTableHeaderCell
            axisClippingResult={clippingResult.columns}
            index={index}
            level={level}
            getHeader={(idx) => engine.getColumnHeader(idx)}
            showHierarchy={engine.visualization.showHierarchy}
            render={(header) => {
                const isSortable =
                    level === engine.columnDepth - 1 &&
                    header.span === 1 &&
                    engine.isSortable(index)

                const style = {
                    cursor: isSortable ? 'pointer' : 'default',
                    width,
                    height,
                    whiteSpace:
                        level === engine.columnDepth - 1
                            ? 'pre-line'
                            : 'nowrap',
                }

                if (engine.options.fixColumnHeaders) {
                    style.top =
                        level * (engine.fontSize + engine.cellPadding * 2 + 2)
                    // left value for the column header cells should be sum of row headers' width when engine.options.fixRowHeaders is true
                    style.left = engine.options.fixRowHeaders
                        ? engine.rowHeaderPixelWidth
                        : 0
                }

                return (
                    <PivotTableCell
                        isHeader
                        classes={[
                            header.label &&
                            header.label !== 'Total' &&
                            header.label !== 'Subtotal' // TODO: Actually look up the column type!
                                ? 'column-header'
                                : 'empty-header',
                            {
                                'fixed-header': engine.options.fixColumnHeaders,
                            },
                        ]}
                        colSpan={header.span}
                        title={header.label}
                        style={style}
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
    clippingResult: PropTypes.shape({
        columns: PropTypes.object.isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    onSortByColumn: PropTypes.func.isRequired,
    sortBy: PropTypes.shape({
        column: PropTypes.number.isRequired,
        order: PropTypes.number.isRequired,
    }),
}
