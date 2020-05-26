import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { applyLegendSet } from '../../modules/pivotTable/applyLegendSet'
import { PivotTableCell } from './PivotTableCell'
import { usePivotTableEngine } from './PivotTableEngineContext'
import {
    VALUE_TYPE_NUMBER,
    CELL_TYPE_VALUE,
} from '../../modules/pivotTable/pivotTableConstants'
import { PivotTableEmptyCell } from './PivotTableEmptyCell'

export const PivotTableValueCell = ({
    row,
    column,
    onToggleContextualMenu,
}) => {
    const engine = usePivotTableEngine()
    const cellRef = useRef(undefined)

    const cellContent = engine.get({
        row,
        column,
    })

    if (!cellContent || cellContent.empty) {
        return (
            <PivotTableEmptyCell
                type={cellContent?.cellType}
                onClick={onToggleContextualMenu ? onClick : undefined}
                ref={cellRef}
            />
        )
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

    const isClickable =
        onToggleContextualMenu &&
        cellContent.cellType === CELL_TYPE_VALUE &&
        cellContent.ouId
    const classes = [
        cellContent.cellType,
        cellContent.valueType,
        isClickable && 'clickable',
    ]
    const onClick = () => {
        onToggleContextualMenu(cellRef, cellContent)
    }

    return (
        <PivotTableCell
            key={column}
            classes={classes}
            title={cellContent.renderedValue}
            style={style}
            onClick={isClickable ? onClick : undefined}
            ref={cellRef}
        >
            {cellContent.renderedValue ?? null}
        </PivotTableCell>
    )
}

PivotTableValueCell.propTypes = {
    column: PropTypes.number.isRequired,
    row: PropTypes.number.isRequired,
    onToggleContextualMenu: PropTypes.func,
}
