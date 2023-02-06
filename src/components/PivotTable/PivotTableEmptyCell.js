import React from 'react'
import { PivotTableCell } from './PivotTableCell.js'
import { cell as cellStyle } from './styles/PivotTable.style.js'

export const PivotTableEmptyCell = React.forwardRef(({ ...props }, ref) => {
    return (
        <PivotTableCell ref={ref} {...props}>
            <style jsx>{cellStyle}</style>
        </PivotTableCell>
    )
})

PivotTableEmptyCell.displayName = 'PivotTableEmptyCell'
