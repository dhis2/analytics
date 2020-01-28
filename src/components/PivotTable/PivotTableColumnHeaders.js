import React from 'react'
import PropTypes from 'prop-types'
import { PivotTableClippedAxis } from './PivotTableClippedAxis'
import { PivotTableColumnHeaderCell } from './PivotTableColumnHeaderCell'
import { PivotTableDimensionLabelCell } from './PivotTableDimensionLabelCell'

export const PivotTableColumnHeaders = ({ engine, clippingResult }) => {
    return engine.dimensionLookup.columns.map((_, level) => (
        <tr key={level}>
            <PivotTableDimensionLabelCell engine={engine} />
            <PivotTableClippedAxis
                axisClippingResult={clippingResult.columns}
                EmptyComponent={({ size }) => <th style={{ minWidth: size }} />}
                renderItem={index => (
                    <PivotTableColumnHeaderCell
                        engine={engine}
                        clippingResult={clippingResult}
                        index={index}
                        level={level}
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
    engine: PropTypes.object.isRequired,
}
