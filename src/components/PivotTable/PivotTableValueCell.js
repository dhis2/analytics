import React from 'react'
import PropTypes from 'prop-types'
import { cell as cellStyle } from './styles/PivotTable.style'

export const PivotTableValueCell = ({ engine, row, column }) => {
    const value = engine.get({
        row,
        column,
        field: 'value',
    })
    const type = engine.getCellType({
        row,
        column,
    })
    return (
        <td key={column} className={type}>
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
