import React from 'react'
import PropTypes from 'prop-types'
import { PivotTableHeaderCell } from './PivotTableHeaderCell'
import { cell as cellStyle } from './styles/PivotTable.style'

export const PivotTableColumnHeaderCell = ({
    engine,
    clippingResult,
    index,
    level,
}) => (
    <PivotTableHeaderCell
        axisClippingResult={clippingResult.columns}
        index={index}
        level={level}
        getHeader={idx => engine.getColumnHeader(idx)}
        render={header => (
            <th
                className={
                    header.name && header.name !== 'TOTAL'
                        ? 'column-header'
                        : 'empty-header'
                }
                colSpan={header.span}
                title={header.name}
            >
                <style jsx>{cellStyle}</style>
                {header.name}
            </th>
        )}
    />
)

PivotTableColumnHeaderCell.propTypes = {
    clippingResult: PropTypes.shape({ columns: PropTypes.object.isRequired })
        .isRequired,
    engine: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
}
