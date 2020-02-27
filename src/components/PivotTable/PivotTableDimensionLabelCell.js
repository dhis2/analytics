import React from 'react'
import PropTypes from 'prop-types'
import { usePivotTableEngine } from './PivotTableEngineContext'
import { PivotTableCell } from './PivotTableCell'

const getDimensionLabel = (engine, rowLevel, columnLevel) => {
    const lastRowLevel = engine.dimensionLookup.rows.length - 1
    const lastColumnLevel = engine.dimensionLookup.columns.length - 1
    if (rowLevel !== lastRowLevel && columnLevel !== lastColumnLevel) {
        return null
    }
    if (rowLevel === lastRowLevel && columnLevel === lastColumnLevel) {
        return `${engine.dimensionLookup.rows[lastRowLevel].meta.name} / ${engine.dimensionLookup.columns[lastColumnLevel].meta.name}`
    }

    if (rowLevel === lastRowLevel) {
        return engine.dimensionLookup.columns[columnLevel].meta.name
    }
    if (columnLevel === lastColumnLevel) {
        return engine.dimensionLookup.rows[rowLevel].meta.name
    }
}

export const PivotTableDimensionLabelCell = ({ rowLevel, columnLevel }) => {
    const engine = usePivotTableEngine()

    const colCount = engine.dimensionLookup.rows.length
    const rowCount = engine.dimensionLookup.columns.length

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
        label = getDimensionLabel(engine, rowLevel, columnLevel)
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

    return (
        <PivotTableCell
            classes={['empty-header', 'column-header']}
            colSpan={colSpan}
            rowSpan={rowSpan}
            title={label}
        >
            {label}
        </PivotTableCell>
    )
}

PivotTableDimensionLabelCell.propTypes = {
    columnLevel: PropTypes.number.isRequired,
    rowLevel: PropTypes.number.isRequired,
}
