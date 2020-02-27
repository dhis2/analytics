import React, { useRef, useMemo } from 'react'
import PropTypes from 'prop-types'

import { PivotTableEngine } from '../../modules/pivotTable/PivotTableEngine'
import { useParentSize } from '../../modules/pivotTable/useParentSize'
import { useTableClipping } from '../../modules/pivotTable/useTableClipping'
import { Provider } from './PivotTableEngineContext'
import { PivotTableContainer } from './PivotTableContainer'
import { PivotTableHead } from './PivotTableHead'
import { PivotTableBody } from './PivotTableBody'
import { useSortableColumns } from '../../modules/pivotTable/useSortableColumns'

const PivotTable = ({ visualization, data, legendSets }) => {
    const containerRef = useRef(undefined)
    const { width, height } = useParentSize(containerRef)

    const engine = useMemo(
        () => new PivotTableEngine(visualization, data, legendSets),
        [visualization, data, legendSets]
    )

    const { sortBy, onSortByColumn } = useSortableColumns(engine)

    const clippingResult = useTableClipping({
        containerRef,
        width,
        height,
        engine,
        visualization,
    })

    return (
        <Provider engine={engine}>
            <PivotTableContainer
                ref={containerRef}
                width={width}
                height={height}
            >
                <PivotTableHead
                    clippingResult={clippingResult}
                    width={width}
                    sortBy={sortBy}
                    onSortByColumn={onSortByColumn}
                />
                <PivotTableBody clippingResult={clippingResult} />
            </PivotTableContainer>
        </Provider>
    )
}

PivotTable.propTypes = {
    data: PropTypes.object.isRequired,
    visualization: PropTypes.object.isRequired,
    legendSets: PropTypes.arrayOf(PropTypes.object),
}

export default PivotTable
