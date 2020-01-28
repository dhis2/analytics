import React from 'react'
import PropTypes from 'prop-types'
import { PivotTableHeaderCell } from './PivotTableHeaderCell'
import { cell as cellStyle } from './styles/PivotTable.style'

export const PivotTableRowHeaderCell = ({
    engine,
    clippingResult,
    rowIndex,
    rowLevel,
}) => (
    <PivotTableHeaderCell
        axisClippingResult={clippingResult.rows}
        index={rowIndex}
        level={rowLevel}
        getHeader={idx => engine.getRowHeader(idx)}
        render={header => (
            <td
                className={
                    header.name && header.name !== 'TOTAL'
                        ? 'row-header'
                        : 'empty-header'
                }
                rowSpan={header.span}
            >
                <style jsx>{cellStyle}</style>
                {header.name}
            </td>
        )}
    />
)

PivotTableRowHeaderCell.propTypes = {
    clippingResult: PropTypes.shape({ rows: PropTypes.object.isRequired })
        .isRequired,
    engine: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
    rowLevel: PropTypes.number.isRequired,
}
