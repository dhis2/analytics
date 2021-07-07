import PropTypes from 'prop-types'
import React from 'react'
import { PivotTableCell } from './PivotTableCell'
import { usePivotTableEngine } from './PivotTableEngineContext'

export const PivotTableDimensionLabelCell = ({ rowLevel, columnLevel }) => {
    const engine = usePivotTableEngine()

    const colCount = engine.rowDepth
    const rowCount = engine.columnDepth

    let colSpan = 1,
        rowSpan = 1,
        label

    if (!engine.visualization.showDimensionLabels) {
        if (rowLevel > 0 || columnLevel > 0) {
            colSpan = rowSpan = 0
        } else {
            colSpan = colCount
            rowSpan = rowCount
        }
    } else {
        label = engine.getDimensionLabel(rowLevel, columnLevel)
        if (!label) {
            if (rowLevel > 0 || columnLevel > 0) {
                colSpan = rowSpan = 0
            } else {
                colSpan = colCount - 1
                rowSpan = rowCount - 1
            }
        }
    }

    if (!colSpan || !rowSpan) {
        return null
    }

    const width = engine.rowHeaderWidths[rowLevel]
    const style = {
        width,
        maxWidth: width,
        minWidth: width,
    }

    if (engine.options.fixedColumnHeaders || engine.options.fixedRowHeaders) {
        style.zIndex =
            engine.options.fixedColumnHeaders && engine.options.fixedRowHeaders
                ? 2
                : 1
        style.top = engine.options.fixedColumnHeaders
            ? columnLevel * (engine.fontSize + engine.cellPadding * 2 + 2)
            : 0
        style.left = engine.options.fixedRowHeaders
            ? // calculate the width of all row header cells on the left of current cell
              engine.rowHeaderWidths
                  .slice(0, rowLevel)
                  .reduce((width, acc) => (acc += width), 0)
            : 0
    }

    return (
        <PivotTableCell
            isHeader={true}
            classes={[
                'empty-header',
                'column-header',
                {
                    fixedHeader:
                        engine.options.fixedColumnHeaders ||
                        engine.options.fixedRowHeaders,
                },
            ]}
            colSpan={colSpan}
            rowSpan={rowSpan}
            title={label}
            style={style}
        >
            {label}
        </PivotTableCell>
    )
}

PivotTableDimensionLabelCell.propTypes = {
    columnLevel: PropTypes.number.isRequired,
    rowLevel: PropTypes.number.isRequired,
}
