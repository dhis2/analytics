import React from 'react'
import PropTypes from 'prop-types'
import { renderValue } from '../../modules/pivotTable/renderValue'
import { applyLegendSet } from '../../modules/pivotTable/applyLegendSet'
import { PivotTableCell } from './PivotTableCell'
import { usePivotTableEngine } from './PivotTableEngineContext'

export const PivotTableValueCell = ({ row, column }) => {
    const engine = usePivotTableEngine()

    const rawValue = engine.get({
        row,
        column,
    })

    const dxDimension = engine.getCellDxDimension({ row, column })

    const value = renderValue(
        rawValue,
        dxDimension?.valueType,
        engine.visualization
    )
    const type = engine.getCellType({
        row,
        column,
    })

    // TODO: Add support for 'INTEGER' type (requires server changes)
    const legendStyle =
        type === 'value' && dxDimension?.valueType === 'NUMBER'
            ? applyLegendSet(parseFloat(rawValue), dxDimension, engine)
            : undefined

    const width = engine.columnWidths[engine.columnMap[column]].width
    const style = {
        ...legendStyle,
        width,
        minWidth: width,
        maxWidth: width,
    }

    return (
        <PivotTableCell
            key={column}
            classes={[type, dxDimension?.valueType]}
            title={value}
            style={style}
        >
            {value ?? null}
        </PivotTableCell>
    )
}

PivotTableValueCell.propTypes = {
    column: PropTypes.number.isRequired,
    row: PropTypes.number.isRequired,
}
