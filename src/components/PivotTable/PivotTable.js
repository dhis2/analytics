import PropTypes from 'prop-types'
import React, { useRef, useMemo } from 'react'
import { PivotTableEngine } from '../../modules/pivotTable/PivotTableEngine'
import { useParentSize } from '../../modules/pivotTable/useParentSize'
import { useSortableColumns } from '../../modules/pivotTable/useSortableColumns'
import { useTableClipping } from '../../modules/pivotTable/useTableClipping'
import { PivotTableBody } from './PivotTableBody'
import { PivotTableContainer } from './PivotTableContainer'
import { Provider } from './PivotTableEngineContext'
import { PivotTableHead } from './PivotTableHead'

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
                <PivotTableBody
                    clippingResult={clippingResult}
                    onToggleContextualMenu={onToggleContextualMenu}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        background: '#fff',
                        left: 0,
                        right: 0,
                        padding: '8px',
                    }}
                >
                    {legendSets.map(legendSet => (
                        <div
                            key={legendSet.id}
                            style={{
                                display: 'inline-flex',
                                marginLeft: '20px',
                            }}
                        >
                            <span style={{ paddingRight: '8px' }}>
                                {legendSet.name}
                            </span>
                            {legendSet.legends
                                .sort((a, b) => a.startValue - b.startValue)
                                .map(legend => (
                                    <div
                                        key={legend.startValue}
                                        style={{
                                            display: 'inline-block',
                                            height: '20px',
                                            width: '20px',
                                            background: legend.color,
                                            borderRadius: '100px',
                                            marginRight: '10px',
                                        }}
                                    ></div>
                                ))}
                        </div>
                    ))}
                </div>
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
