import React from 'react'
import PropTypes from 'prop-types'
import { cell as cellStyle } from './styles/PivotTable.style'

export const PivotTableEmptyCell = ({ type }) => {
    const C = () => (type === 'col-header' ? <th /> : <td />)
    return (
        <C className={type}>
            <style jsx>{cellStyle}</style>
        </C>
    )
}

PivotTableEmptyCell.propTypes = {
    type: PropTypes.string.isRequired,
}
