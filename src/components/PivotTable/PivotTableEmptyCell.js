import React from 'react'
import { cell as cellStyle } from './styles/PivotTable.style'
import { PivotTableCell } from './PivotTableCell'

export const PivotTableEmptyCell = React.forwardRef(({ ...props }, ref) => {
    return (
        <PivotTableCell ref={ref} {...props}>
            <style jsx>{cellStyle}</style>
        </PivotTableCell>
    )
})

PivotTableEmptyCell.displayName = 'PivotTableEmptyCell'
