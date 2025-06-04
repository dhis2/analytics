import PropTypes from 'prop-types'
import React from 'react'
import { PivotTableClippedAxis } from './PivotTableClippedAxis.jsx'
import { PivotTableEmptyRow } from './PivotTableEmptyRow.jsx'
import { PivotTableRow } from './PivotTableRow.jsx'

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
