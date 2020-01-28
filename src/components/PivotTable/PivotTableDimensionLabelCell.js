import React from 'react'
import PropTypes from 'prop-types'
import { cell as cellStyle } from './styles/PivotTable.style'

export const PivotTableDimensionLabelCell = ({ engine }) => (
    <th colSpan={engine.rowDepth} className="empty-header row-header">
        <style jsx>{cellStyle}</style>
    </th>
)

PivotTableDimensionLabelCell.propTypes = {
    engine: PropTypes.object.isRequired,
}
