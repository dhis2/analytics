import { useState } from 'react'
import { SORT_ORDER_ASCENDING, SORT_ORDER_DESCENDING } from './PivotTableEngine'

export const useSortableColumns = engine => {
    const [sortBy, setSortBy] = useState(null)

    const onSortByColumn = column => {
        let order = SORT_ORDER_ASCENDING
        if (sortBy && sortBy.column === column) {
            if (sortBy.order === SORT_ORDER_ASCENDING) {
                order = SORT_ORDER_DESCENDING
            } else if (sortBy.order === SORT_ORDER_DESCENDING) {
                engine.clearSort()
                setSortBy(null)
                return
            }
        }
        engine.sort(column, order)
        setSortBy({ column, order }) // Force a re-render
    }

    return {
        sortBy,
        onSortByColumn,
    }
}
