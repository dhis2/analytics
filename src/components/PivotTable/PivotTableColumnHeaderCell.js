import React from 'react'
import PropTypes from 'prop-types'
import { PivotTableHeaderCell } from './PivotTableHeaderCell'
import { cell as cellStyle } from './styles/PivotTable.style'

export const PivotTableColumnHeaderCell = ({
    engine,
    clippingResult,
    index,
    level,
    onSortByColumn,
}) => (
    <PivotTableHeaderCell
        axisClippingResult={clippingResult.columns}
        index={index}
        level={level}
        getHeader={idx => engine.getColumnHeader(idx)}
        render={header => {
            const isSortable =
                level === engine.dimensionLookup.columns.length - 1 &&
                header.span === 1 &&
                engine.isSortable(index)
            return (
                <th
                    className={
                        header.name &&
                        header.name !== 'Total' &&
                        header.name !== 'Subtotal' // TODO: Actually look up the column type!
                            ? 'column-header'
                            : 'empty-header'
                    }
                    colSpan={header.span}
                    title={header.name}
                    style={{ cursor: isSortable ? 'pointer' : 'default' }}
                    onClick={
                        isSortable ? () => onSortByColumn(index) : undefined
                    }
                >
                    <style jsx>{cellStyle}</style>
                    {header.name}
                    {isSortable ? <span>&#8645;</span> : null}
                </th>
            )
        }}
    />
)

PivotTableColumnHeaderCell.propTypes = {
    clippingResult: PropTypes.shape({ columns: PropTypes.object.isRequired })
        .isRequired,
    engine: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    onSortByColumn: PropTypes.func.isRequired,
}
