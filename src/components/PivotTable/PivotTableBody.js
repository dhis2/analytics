import PropTypes from 'prop-types'
import React from 'react'
import { PivotTableClippedAxis } from './PivotTableClippedAxis'
import { PivotTableEmptyRow } from './PivotTableEmptyRow'
import { PivotTableRow } from './PivotTableRow'
import { tbody as tbodyStyle } from './styles/PivotTable.style'

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
        <style jsx>{tbodyStyle}</style>
    </tbody>
)

PivotTableBody.propTypes = {
    clippingResult: PropTypes.object.isRequired,
    onToggleContextualMenu: PropTypes.func,
}
