import React, { useRef, useMemo } from 'react'
import PropTypes from 'prop-types'

import { table as tableStyle } from './styles/PivotTable.style'
import { PivotTableEngine } from '../../modules/pivotTable/PivotTableEngine'
import { useParentSize } from '../../modules/pivotTable/useParentSize'
import { PivotTableColumnHeaders } from './PivotTableColumnHeaders'
import { useTableClipping } from '../../modules/pivotTable/useTableClipping'
import { PivotTableRow } from './PivotTableRow'
import { PivotTableClippedAxis } from './PivotTableClippedAxis'

const PivotTable = ({ visualization, data, options }) => {
    const containerRef = useRef(undefined)
    const { width, height } = useParentSize(containerRef)

    const engine = useMemo(
        () => new PivotTableEngine(visualization, data, options),
        [visualization, data, options]
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
                        <PivotTableColumnHeaders
                            engine={engine}
                            clippingResult={clippingResult}
                        />
                    </thead>
                    <tbody>
                        <PivotTableClippedAxis
                            axisClippingResult={clippingResult.rows}
                            EmptyComponent={({ size }) => (
                                <tr>
                                    <td style={{ height: size }} />
                                </tr>
                            )}
                            renderItem={index => (
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
    options: PropTypes.object.isRequired,
    visualization: PropTypes.object.isRequired,
}

export default PivotTable
