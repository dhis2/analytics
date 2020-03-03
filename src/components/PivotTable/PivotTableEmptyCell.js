import React from 'react'
import PropTypes from 'prop-types'
import { cell as cellStyle } from './styles/PivotTable.style'
import { PivotTableCell } from './PivotTableCell'

export const PivotTableEmptyCell = ({ type, ...props }) => {
    return (
        <PivotTableCell className={type} {...props}>
            <style jsx>{cellStyle}</style>
        </PivotTableCell>
    )
}

PivotTableEmptyCell.propTypes = {
    type: PropTypes.string.isRequired,
}
