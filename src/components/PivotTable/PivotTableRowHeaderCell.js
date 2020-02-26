import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
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
        showHierarchy={engine.visualization.showHierarchy}
        render={header => (
            <td
                className={classnames(
                    header.label &&
                        header.label !== 'Total' &&
                        header.label !== 'Subtotal'
                        ? 'row-header'
                        : 'empty-header',
                    `fontsize-${engine.visualization.fontSize}`,
                    `displaydensity-${engine.visualization.displayDensity}`
                )}
                rowSpan={header.span}
                title={header.label}
            >
                <style jsx>{cellStyle}</style>
                {header.label}
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
