import React from 'react'
import PropTypes from 'prop-types'
import { PivotTableClippedAxis } from './PivotTableClippedAxis'
import { PivotTableEmptyRow } from './PivotTableEmptyRow'
import { PivotTableRow } from './PivotTableRow'

export const PivotTableBody = ({ clippingResult }) => (
    <tbody>
        <PivotTableClippedAxis
            axisClippingResult={clippingResult.rows}
            EmptyComponent={({ size }) => (
                <PivotTableEmptyRow
                    height={size}
                    columns={clippingResult.columns.indices}
                />
            )}
            ItemComponent={({ index }) => (
                <PivotTableRow
                    key={index}
                    clippingResult={clippingResult}
                    rowIndex={index}
                />
            )}
        />
    </tbody>
)

PivotTableBody.propTypes = {
    clippingResult: PropTypes.object.isRequired,
}
