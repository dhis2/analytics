import React from 'react'
import PropTypes from 'prop-types'
import { PivotTableHeaderCell } from './PivotTableHeaderCell'
import { PivotTableCell } from './PivotTableCell'
import { usePivotTableEngine } from './PivotTableEngineContext'

export const PivotTableRowHeaderCell = ({
    clippingResult,
    rowIndex,
    rowLevel,
}) => {
    const engine = usePivotTableEngine()
    const width = engine.rowHeaderWidths[rowLevel]

    return (
        <PivotTableHeaderCell
            axisClippingResult={clippingResult.rows}
            index={rowIndex}
            level={rowLevel}
            getHeader={idx => engine.getRowHeader(idx)}
            showHierarchy={engine.visualization.showHierarchy}
            render={header => (
                <PivotTableCell
                    classes={[
                        header.label &&
                        header.label !== 'Total' &&
                        header.label !== 'Subtotal'
                            ? 'row-header'
                            : 'empty-header',
                        header.includesHierarchy && 'row-header-hierarchy',
                    ]}
                    rowSpan={header.span}
                    title={header.label}
                    style={{ width, maxWidth: width, minWidth: width }}
                >
                    {header.label}
                </PivotTableCell>
            )}
        />
    )
}

PivotTableRowHeaderCell.propTypes = {
    clippingResult: PropTypes.shape({ rows: PropTypes.object.isRequired })
        .isRequired,
    rowIndex: PropTypes.number.isRequired,
    rowLevel: PropTypes.number.isRequired,
}
