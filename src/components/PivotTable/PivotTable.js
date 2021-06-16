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
                        top: 0,
                        background: '#fff',
                        right: 0,
                        padding: '8px',
                        width: '180px',
                    }}
                >
                    {legendSets.map(legendSet => (
                        <div
                            key={legendSet.id}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginLeft: '4px',
                                fontSize: '13px',
                            }}
                        >
                            {legendSet.legends
                                .sort((a, b) => a.startValue - b.startValue)
                                .map(legend => (
                                    <div
                                        key={legend.startValue}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            flexWrap: 'wrap',
                                            borderLeft: `6px ${legend.color} solid`,
                                            padding: '4px 0 4px 4px',
                                            whiteSpace: 'break-spaces',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <span>{legend.name}</span>
                                        <span>{`${legend.startValue}-<${legend.endValue}`}</span>
                                    </div>
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
