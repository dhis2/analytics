import PropTypes from 'prop-types'
import React, { useRef, useMemo } from 'react'
import { PivotTableEngine } from '../../modules/pivotTable/PivotTableEngine.js'
import { useParentSize } from '../../modules/pivotTable/useParentSize.js'
import { useSortableColumns } from '../../modules/pivotTable/useSortableColumns.js'
import { useTableClipping } from '../../modules/pivotTable/useTableClipping.js'
import { PivotTableBody } from './PivotTableBody.js'
import { PivotTableContainer } from './PivotTableContainer.js'
import { Provider } from './PivotTableEngineContext.js'
import { PivotTableHead } from './PivotTableHead.js'

const PivotTable = ({
    visualization,
    data,
    legendSets,
    renderCounter,
    onToggleContextualMenu,
}) => {
    const containerRef = useRef(undefined)
    const { width, height } = useParentSize(containerRef, renderCounter)

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
                <PivotTableBody
                    clippingResult={clippingResult}
                    onToggleContextualMenu={onToggleContextualMenu}
                />
            </PivotTableContainer>
        </Provider>
    )
}

PivotTable.propTypes = {
    data: PropTypes.object.isRequired,
    visualization: PropTypes.object.isRequired,
    legendSets: PropTypes.arrayOf(PropTypes.object),
    renderCounter: PropTypes.number,
    onToggleContextualMenu: PropTypes.func,
}

export default PivotTable
