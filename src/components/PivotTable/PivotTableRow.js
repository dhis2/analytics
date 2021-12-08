import times from 'lodash/times'
import PropTypes from 'prop-types'
import React from 'react'
import { PivotTableClippedAxis } from './PivotTableClippedAxis.js'
import { PivotTableEmptyCell } from './PivotTableEmptyCell.js'
import { usePivotTableEngine } from './PivotTableEngineContext.js'
import { PivotTableRowHeaderCell } from './PivotTableRowHeaderCell.js'
import { PivotTableValueCell } from './PivotTableValueCell.js'

export const PivotTableRow = ({
    clippingResult,
    rowIndex,
    onToggleContextualMenu,
}) => {
    const engine = usePivotTableEngine()
    return (
        <tr>
            {times(engine.rowDepth, (x) => x).map((rowLevel) => (
                <PivotTableRowHeaderCell
                    key={rowLevel}
                    clippingResult={clippingResult}
                    rowIndex={rowIndex}
                    rowLevel={rowLevel}
                />
            ))}
            <PivotTableClippedAxis
                axisClippingResult={clippingResult.columns}
                EmptyComponent={({ size }) => (
                    <PivotTableEmptyCell
                        classes="value"
                        style={{ width: size }}
                    />
                )}
                ItemComponent={({ index: columnIndex }) => (
                    <PivotTableValueCell
                        row={rowIndex}
                        column={columnIndex}
                        onToggleContextualMenu={onToggleContextualMenu}
                    />
                )}
            />
        </tr>
    )
}

PivotTableRow.propTypes = {
    clippingResult: PropTypes.shape({
        columns: PropTypes.object.isRequired,
        rows: PropTypes.object.isRequired,
    }).isRequired,
    rowIndex: PropTypes.number.isRequired,
    onToggleContextualMenu: PropTypes.func,
}
