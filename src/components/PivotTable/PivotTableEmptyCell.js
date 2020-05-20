import React from 'react'
import PropTypes from 'prop-types'
import { cell as cellStyle } from './styles/PivotTable.style'
import { PivotTableCell } from './PivotTableCell'

export const PivotTableEmptyCell = React.forwardRef(
    ({ type, ...props }, ref) => {
        return (
            <PivotTableCell ref={ref} className={type} {...props}>
                <style jsx>{cellStyle}</style>
            </PivotTableCell>
        )
    }
)

PivotTableEmptyCell.displayName = 'PivotTableEmptyCell'

PivotTableEmptyCell.propTypes = {
    type: PropTypes.string.isRequired,
}
