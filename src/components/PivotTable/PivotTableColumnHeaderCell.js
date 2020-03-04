import React from 'react'
import PropTypes from 'prop-types'
import { PivotTableHeaderCell } from './PivotTableHeaderCell'
import { cell as cellStyle } from './styles/PivotTable.style'

import { PivotTableCell } from './PivotTableCell'
import { usePivotTableEngine } from './PivotTableEngineContext'
import { PivotTableSortIcon } from './PivotTableSortIcon'

export const PivotTableColumnHeaderCell = ({
    clippingResult,
    index,
    level,
    onSortByColumn,
    sortBy,
}) => {
    const engine = usePivotTableEngine()

    const width = engine.columnWidths[index]?.width

    return (
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
                            maxWidth: width,
                            minWidth: width,
                        }}
                        onClick={
                            isSortable ? () => onSortByColumn(index) : undefined
                        }
                    >
                        <style jsx>{cellStyle}</style>
                        <div className="column-header-inner">
                            <span className="column-header-label">
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
