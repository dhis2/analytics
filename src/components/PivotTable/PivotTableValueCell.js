import React from 'react'
import PropTypes from 'prop-types'
import { applyLegendSet } from '../../modules/pivotTable/applyLegendSet'
import { PivotTableCell } from './PivotTableCell'
import { usePivotTableEngine } from './PivotTableEngineContext'
import {
    VALUE_TYPE_NUMBER,
    CELL_TYPE_VALUE,
} from '../../modules/pivotTable/pivotTableConstants'
import { PivotTableEmptyCell } from './PivotTableEmptyCell'

export const PivotTableValueCell = ({ row, column }) => {
    const engine = usePivotTableEngine()

    const cellContent = engine.get({
        row,
        column,
    })

    if (!cellContent || cellContent.empty) {
        return <PivotTableEmptyCell classes={cellContent?.cellType} />
    }

    // TODO: Add support for 'INTEGER' type (requires server changes)
    const legendStyle =
        cellContent.cellType === CELL_TYPE_VALUE &&
        cellContent.valueType === VALUE_TYPE_NUMBER
            ? applyLegendSet(
                  cellContent.rawValue,
                  cellContent.dxDimension,
                  engine
              )
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
            classes={[cellContent.cellType, cellContent.valueType]}
            title={cellContent.renderedValue}
            style={style}
        >
            {cellContent.renderedValue ?? null}
        </PivotTableCell>
    )
}

PivotTableValueCell.propTypes = {
    column: PropTypes.number.isRequired,
    row: PropTypes.number.isRequired,
}
