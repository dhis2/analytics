import times from 'lodash/times'
import PropTypes from 'prop-types'
import React from 'react'
import { PivotTableClippedAxis } from './PivotTableClippedAxis'
import { PivotTableEmptyCell } from './PivotTableEmptyCell'
import { usePivotTableEngine } from './PivotTableEngineContext'
import { PivotTableRowHeaderCell } from './PivotTableRowHeaderCell'
import { PivotTableValueCell } from './PivotTableValueCell'

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
