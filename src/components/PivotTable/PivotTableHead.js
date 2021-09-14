import PropTypes from 'prop-types'
import React from 'react'
import { PivotTableColumnHeaders } from './PivotTableColumnHeaders'
import { PivotTableTitleRows } from './PivotTableTitleRows'

export const PivotTableHead = ({
    clippingResult,
    width,
    sortBy,
    onSortByColumn,
}) => (
    <thead>
        <PivotTableTitleRows clippingResult={clippingResult} width={width} />
        <PivotTableColumnHeaders
            clippingResult={clippingResult}
            sortBy={sortBy}
            onSortByColumn={onSortByColumn}
        />
    </thead>
)

PivotTableHead.propTypes = {
    clippingResult: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    onSortByColumn: PropTypes.func.isRequired,
    sortBy: PropTypes.object,
}
