import React from 'react'
import PropTypes from 'prop-types'
import { PivotTableClippedAxis } from './PivotTableClippedAxis'
import { PivotTableRowHeaderCell } from './PivotTableRowHeaderCell'
import { PivotTableValueCell } from './PivotTableValueCell'
import { PivotTableEmptyCell } from './PivotTableEmptyCell'

export const PivotTableRow = ({ engine, clippingResult, rowIndex }) => (
    <tr>
        {engine.dimensionLookup.rows.map((_, rowLevel) => (
            <PivotTableRowHeaderCell
                key={rowLevel}
                engine={engine}
                clippingResult={clippingResult}
                rowIndex={rowIndex}
                rowLevel={rowLevel}
            />
        ))}
        <PivotTableClippedAxis
            axisClippingResult={clippingResult.columns}
            EmptyComponent={() => <PivotTableEmptyCell type="value" />}
            renderItem={columnIndex => (
                <PivotTableValueCell
                    engine={engine}
                    row={rowIndex}
                    column={columnIndex}
                />
            )}
        />
    </tr>
)

PivotTableRow.propTypes = {
    clippingResult: PropTypes.shape({
        columns: PropTypes.object.isRequired,
        rows: PropTypes.object.isRequired,
    }).isRequired,
    engine: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
}
