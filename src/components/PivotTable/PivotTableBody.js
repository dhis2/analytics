import PropTypes from 'prop-types'
import React from 'react'
import { PivotTableClippedAxis } from './PivotTableClippedAxis.js'
import { PivotTableEmptyRow } from './PivotTableEmptyRow.js'
import { PivotTableRow } from './PivotTableRow.js'

export const PivotTableBody = ({ clippingResult, onToggleContextualMenu }) => (
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
                    onToggleContextualMenu={onToggleContextualMenu}
                />
            )}
        />
    </tbody>
)

PivotTableBody.propTypes = {
    clippingResult: PropTypes.object.isRequired,
    onToggleContextualMenu: PropTypes.func,
}
