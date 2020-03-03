import React from 'react'
import PropTypes from 'prop-types'
import { PivotTableClippedAxis } from './PivotTableClippedAxis'
import { PivotTableColumnHeaderCell } from './PivotTableColumnHeaderCell'
import { PivotTableDimensionLabelCell } from './PivotTableDimensionLabelCell'
import { PivotTableEmptyCell } from './PivotTableEmptyCell'
import { usePivotTableEngine } from './PivotTableEngineContext'

export const PivotTableColumnHeaders = ({
    clippingResult,
    onSortByColumn,
    sortBy,
}) => {
    const engine = usePivotTableEngine()

    return engine.dimensionLookup.columns.map((_, columnLevel) => (
        <tr key={columnLevel}>
            {engine.dimensionLookup.rows.map((_, rowLevel) => (
                <PivotTableDimensionLabelCell
                    key={rowLevel}
                    rowLevel={rowLevel}
                    columnLevel={columnLevel}
                />
            ))}
            <PivotTableClippedAxis
                axisClippingResult={clippingResult.columns}
                EmptyComponent={({ size }) => (
                    <PivotTableEmptyCell
                        type="column-header"
                        style={{ minWidth: size }}
                    />
                )}
                ItemComponent={({ index }) => (
                    <PivotTableColumnHeaderCell
                        clippingResult={clippingResult}
                        index={index}
                        level={columnLevel}
                        onSortByColumn={onSortByColumn}
                        sortBy={sortBy}
                    />
                )}
            />
        </tr>
    ))
}

PivotTableColumnHeaders.propTypes = {
    clippingResult: PropTypes.shape({
        columns: PropTypes.object.isRequired,
    }).isRequired,
    onSortByColumn: PropTypes.func.isRequired,
    sortBy: PropTypes.shape({
        column: PropTypes.number.isRequired,
        order: PropTypes.number.isRequired,
    }),
}
