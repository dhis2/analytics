import React from 'react'
import PropTypes from 'prop-types'
import { cell as cellStyle } from './styles/PivotTable.style'
import { renderValue } from '../../modules/pivotTable/renderValue'

export const PivotTableValueCell = ({ engine, row, column }) => {
    const value = renderValue(
        engine.get({
            row,
            column,
        }),
        engine.visualization
    )
    const type = engine.getCellType({
        row,
        column,
    })
    return (
        <td key={column} className={type} title={value}>
            <style jsx>{cellStyle}</style>
            {value || null}
        </td>
    )
}

PivotTableValueCell.propTypes = {
    column: PropTypes.number.isRequired,
    engine: PropTypes.object.isRequired,
    row: PropTypes.number.isRequired,
}
