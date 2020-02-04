import React from 'react'
import PropTypes from 'prop-types'
import { cell as cellStyle } from './styles/PivotTable.style'

export const PivotTableEmptyCell = ({ type, ...props }) => {
    return (
        <td className={type} {...props}>
            <style jsx>{cellStyle}</style>
        </td>
    )
}

PivotTableEmptyCell.propTypes = {
    type: PropTypes.string.isRequired,
}
