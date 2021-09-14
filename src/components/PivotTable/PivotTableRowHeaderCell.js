import PropTypes from 'prop-types'
import React from 'react'
import { PivotTableCell } from './PivotTableCell'
import { usePivotTableEngine } from './PivotTableEngineContext'
import { PivotTableHeaderCell } from './PivotTableHeaderCell'

export const PivotTableRowHeaderCell = ({
    clippingResult,
    rowIndex,
    rowLevel,
}) => {
    const engine = usePivotTableEngine()
    const width =
        engine.adaptiveClippingController.columns.headerSizes[rowLevel]
    const height =
        engine.adaptiveClippingController.rows.sizes[engine.rowMap[rowIndex]]
            ?.size

    return (
        <PivotTableHeaderCell
            axisClippingResult={clippingResult.rows}
            index={rowIndex}
            level={rowLevel}
            getHeader={idx => engine.getRowHeader(idx)}
            showHierarchy={engine.visualization.showHierarchy}
            render={header => (
                <PivotTableCell
                    isHeader
                    classes={[
                        header.label &&
                        header.label !== 'Total' &&
                        header.label !== 'Subtotal'
                            ? 'row-header'
                            : 'empty-header',
                        header.includesHierarchy && 'row-header-hierarchy',
                        {
                            'fixed-header': engine.options.fixRowHeaders,
                        },
                    ]}
                    rowSpan={header.span}
                    title={header.label}
                    style={{
                        width,
                        height,
                        left:
                            rowLevel > 0
                                ? engine.adaptiveClippingController.columns
                                      .headerSizes[rowLevel - 1]
                                : 0,
                    }}
                    dataTest="visualization-row-header"
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
