import React from 'react'
import PropTypes from 'prop-types'
import { usePivotTableEngine } from './PivotTableEngineContext'
import { PivotTableCell } from './PivotTableCell'

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
    return (
        <PivotTableCell
            classes={['empty-header', 'column-header']}
            colSpan={colSpan}
            rowSpan={rowSpan}
            title={label}
            style={{ width, maxWidth: width, minWidth: width }}
        >
            {label}
        </PivotTableCell>
    )
}

PivotTableDimensionLabelCell.propTypes = {
    columnLevel: PropTypes.number.isRequired,
    rowLevel: PropTypes.number.isRequired,
}
