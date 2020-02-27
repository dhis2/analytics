import React from 'react'
import PropTypes from 'prop-types'
import { PivotTableClippedAxis } from './PivotTableClippedAxis'
import { PivotTableRowHeaderCell } from './PivotTableRowHeaderCell'
import { PivotTableValueCell } from './PivotTableValueCell'
import { PivotTableEmptyCell } from './PivotTableEmptyCell'
import { usePivotTableEngine } from './PivotTableEngineContext'

export const PivotTableRow = ({ clippingResult, rowIndex }) => {
    const engine = usePivotTableEngine()
    return (
        <tr>
            {engine.dimensionLookup.rows.map((_, rowLevel) => (
                <PivotTableRowHeaderCell
                    key={rowLevel}
                    clippingResult={clippingResult}
                    rowIndex={rowIndex}
                    rowLevel={rowLevel}
                />
            ))}
            <PivotTableClippedAxis
                axisClippingResult={clippingResult.columns}
                EmptyComponent={() => <PivotTableEmptyCell type="value" />}
                ItemComponent={({ index: columnIndex }) => (
                    <PivotTableValueCell row={rowIndex} column={columnIndex} />
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
}
