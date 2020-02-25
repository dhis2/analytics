import React, { useRef, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { table as tableStyle } from './styles/PivotTable.style'
import {
    PivotTableEngine,
    SORT_ORDER_ASCENDING,
    SORT_ORDER_DESCENDING,
} from '../../modules/pivotTable/PivotTableEngine'
import { useParentSize } from '../../modules/pivotTable/useParentSize'
import { PivotTableColumnHeaders } from './PivotTableColumnHeaders'
import { useTableClipping } from '../../modules/pivotTable/useTableClipping'
import { PivotTableRow } from './PivotTableRow'
import { PivotTableClippedAxis } from './PivotTableClippedAxis'
import { PivotTableTitleRow } from './PivotTableTitleRow'
import { PivotTableEmptyRow } from './PivotTableEmptyRow'

const PivotTable = ({ visualization, data, legendSets }) => {
    const containerRef = useRef(undefined)
    const { width, height } = useParentSize(containerRef)
    const [sortBy, setSortBy] = useState(null)

    const engine = useMemo(
        () => new PivotTableEngine(visualization, data, legendSets),
        [visualization, data, legendSets]
    )

    const clippingResult = useTableClipping({
        containerRef,
        width,
        height,
        engine,
        visualization,
    })

    return (
        <div
            className="pivot-table-container"
            style={{ width, height }}
            ref={containerRef}
        >
            <style jsx>{tableStyle}</style>
            {width === 0 || height === 0 ? null : (
                <table>
                    <thead>
                        {engine.options.title ? (
                            <PivotTableTitleRow
                                engine={engine}
                                title={visualization.title}
                                scrollPosition={clippingResult.scrollPosition}
                                containerWidth={width}
                            />
                        ) : null}
                        {engine.options.subtitle ? (
                            <PivotTableTitleRow
                                engine={engine}
                                title={visualization.subtitle}
                                scrollPosition={clippingResult.scrollPosition}
                                containerWidth={width}
                            />
                        ) : null}
                        <PivotTableColumnHeaders
                            engine={engine}
                            clippingResult={clippingResult}
                            onSortByColumn={column => {
                                let order = SORT_ORDER_ASCENDING
                                if (sortBy && sortBy.column === column) {
                                    if (sortBy.order === SORT_ORDER_ASCENDING) {
                                        order = SORT_ORDER_DESCENDING
                                    } else if (
                                        sortBy.order === SORT_ORDER_DESCENDING
                                    ) {
                                        engine.clearSort()
                                        setSortBy(null)
                                        return
                                    }
                                }
                                engine.sort(column, order)
                                setSortBy({ column, order }) // Force a re-render
                            }}
                        />
                    </thead>
                    <tbody>
                        <PivotTableClippedAxis
                            axisClippingResult={clippingResult.rows}
                            EmptyComponent={({ size }) => (
                                <PivotTableEmptyRow
                                    height={size}
                                    engine={engine}
                                    columns={clippingResult.columns.indices}
                                />
                            )}
                            ItemComponent={({ index }) => (
                                <PivotTableRow
                                    key={index}
                                    engine={engine}
                                    clippingResult={clippingResult}
                                    rowIndex={index}
                                />
                            )}
                        />
                    </tbody>
                </table>
            )}
        </div>
    )
}

PivotTable.propTypes = {
    data: PropTypes.object.isRequired,
    visualization: PropTypes.object.isRequired,
    legendSets: PropTypes.arrayOf(PropTypes.object),
}

export default PivotTable
