import { Checkbox, Divider } from '@dhis2/ui'
import { storiesOf } from '@storybook/react'
import cloneDeep from 'lodash/cloneDeep'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { PivotTable } from '../index.js'
import {
    NUMBER_TYPE_COLUMN_PERCENTAGE,
    NUMBER_TYPE_ROW_PERCENTAGE,
} from '../modules/pivotTable/pivotTableConstants.js'
import avgDataResponse from './data/avgTotalAggregationType.data.json'
import avgMetadataResponse from './data/avgTotalAggregationType.metadata.json'
import avgVisualization from './data/avgTotalAggregationType.visualization.json'
import deepData from './data/deep.data.json'
import deepVisualization from './data/deep.visualization.json'
import deepWithFiltersData from './data/deepWithFilters.data.json'
import deepWithFiltersVisualization from './data/deepWithFilters.visualization.json'
import degsDataResponse from './data/degs.data.json'
import degsMetadataResponse from './data/degs.metadata.json'
import degsVisualization from './data/degs.visualization.json'
import diseaseWeeksDataResponse from './data/diseaseWeeks.data.json'
import diseaseWeeksMetadataResponse from './data/diseaseWeeks.metadata.json'
import diseaseWeeksVisualization from './data/diseaseWeeks.visualization.json'
import emptyColumnsDataResponse from './data/emptyColumns.data.json'
import emptyColumnsMetadataResponse from './data/emptyColumns.metadata.json'
import emptyColumnsVisualization from './data/emptyColumns.visualization.json'
import emptyRowsData from './data/emptyRows.data.json'
import emptyRowsVisualization from './data/emptyRows.visualization.json'
import hierarchyDataResponse from './data/hierarchy.data.json'
import hierarchyMetadataResponse from './data/hierarchy.metadata.json'
import hierarchyVisualization from './data/hierarchy.visualization.json'
import lastFiveYearsDataResponse from './data/lastFiveYears.data.json'
import lastFiveYearsMetadataResponse from './data/lastFiveYears.metadata.json'
import lastFiveYearsVisualization from './data/lastFiveYears.visualization.json'
import narrativeDataResponse from './data/narrative.data.json'
import narrativeMetadataResponse from './data/narrative.metadata.json'
import narrativeVisualization from './data/narrative.visualization.json'
import simpleDataResponse from './data/simple.data.json'
import simpleMetadataResponse from './data/simple.metadata.json'
import simpleVisualization from './data/simple.visualization.json'
import targetDataResponse from './data/target-with-legend.data.json'
import targetMetadataResponse from './data/target-with-legend.metadata.json'
import targetVisualization from './data/target-with-legend.visualization.json'
import underAbove100LegendSet from './data/under-above-100.legendSet.json'
import weeklyColumnsDataResponse from './data/weeklyColumns.data.json'
import weeklyColumnsMetadataResponse from './data/weeklyColumns.metadata.json'
import weeklyColumnsVisualization from './data/weeklyColumns.visualization.json'

const visualizationReset = {
    colTotals: false,
    rowTotals: false,
    colSubTotals: false,
    rowSubTotals: false,
    hideEmptyColumns: false,
    hideEmptyRows: false,
}

const combineDataWithMetadata = (dataResponse, metadataResponse) => ({
    ...dataResponse,
    metaData: metadataResponse.metaData,
})

const simpleData = combineDataWithMetadata(
    simpleDataResponse,
    simpleMetadataResponse
)
const avgData = combineDataWithMetadata(avgDataResponse, avgMetadataResponse)
const emptyColumnsData = combineDataWithMetadata(
    emptyColumnsDataResponse,
    emptyColumnsMetadataResponse
)
const targetData = combineDataWithMetadata(
    targetDataResponse,
    targetMetadataResponse
)
const hierarchyData = combineDataWithMetadata(
    hierarchyDataResponse,
    hierarchyMetadataResponse
)
const narrativeData = combineDataWithMetadata(
    narrativeDataResponse,
    narrativeMetadataResponse
)
const degsData = combineDataWithMetadata(degsDataResponse, degsMetadataResponse)
const diseaseWeeksData = combineDataWithMetadata(
    diseaseWeeksDataResponse,
    diseaseWeeksMetadataResponse
)

const lastFiveYearsData = combineDataWithMetadata(
    lastFiveYearsDataResponse,
    lastFiveYearsMetadataResponse
)

const weeklyColumnsData = combineDataWithMetadata(
    weeklyColumnsDataResponse,
    weeklyColumnsMetadataResponse
)

const PivotTableOptionsWrapper = (story) => {
    const [pivotTableOptions, setPivotTableOptions] = useState({
        fixColumnHeaders: false,
        fixRowHeaders: false,
    })

    return (
        <div>
            <div>
                <Checkbox
                    label="Use fixed column headers"
                    checked={pivotTableOptions.fixColumnHeaders}
                    onChange={({ checked }) =>
                        setPivotTableOptions({
                            ...pivotTableOptions,
                            fixColumnHeaders: checked,
                        })
                    }
                    dense
                />
                <Checkbox
                    label="Use fixed row headers"
                    checked={pivotTableOptions.fixRowHeaders}
                    onChange={({ checked }) =>
                        setPivotTableOptions({
                            ...pivotTableOptions,
                            fixRowHeaders: checked,
                        })
                    }
                    dense
                />
                <Divider />
            </div>
            {story({ pivotTableOptions })}
        </div>
    )
}

storiesOf('PivotTable', module)
    .addDecorator(PivotTableOptionsWrapper)
    .add('simple', (_, { pivotTableOptions }) => {
        const visualization = {
            ...simpleVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={simpleData} visualization={visualization} />
            </div>
        )
    })

storiesOf('PivotTable', module).add(
    'simple - comma DGS',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...simpleVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            digitGroupSeparator: 'COMMA',
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={simpleData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'simple - title / subtitle / filter',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...simpleVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            title: 'This is a Table',
            subtitle: "It's not a very big table",
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={simpleData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'simple - column %',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...simpleVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            colTotals: true,
            numberType: NUMBER_TYPE_COLUMN_PERCENTAGE,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={simpleData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'simple - data as filter',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...simpleVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            columns: simpleVisualization.filters,
            filters: simpleVisualization.columns,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={simpleData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'simple - no columns',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...simpleVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            colTotals: true,
            colSubTotals: true,
            rowTotals: true,
            rowSubTotals: true,
            columns: [],
            filters: simpleVisualization.columns,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={simpleData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'simple - no columns (single cell)',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...simpleVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            title: 'Singular cell',
            columns: [],
            rows: simpleVisualization.columns,
            filters: [],
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={simpleData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'simple - no columns (deep)',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...simpleVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            showDimensionLabels: true,
            title: 'Deep row headers',
            columns: [],
            rows: [simpleVisualization.columns[0], simpleVisualization.rows[0]],
            filters: [],
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={simpleData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'simple - no columns (label)',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...simpleVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            showDimensionLabels: true,
            colTotals: true,
            colSubTotals: true,
            rowTotals: true,
            rowSubTotals: true,
            columns: [],
            filters: simpleVisualization.columns,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={simpleData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'simple - no rows (small)',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...simpleVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            showDimensionLabels: true,
            colTotals: true,
            colSubTotals: true,
            rowTotals: true,
            rowSubTotals: true,
            rows: [],
            filters: simpleVisualization.rows,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={simpleData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'simple - no rows (large)',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...simpleVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            colTotals: true,
            colSubTotals: true,
            rowTotals: true,
            rowSubTotals: true,
            rows: [],
            columns: simpleVisualization.rows,
            filters: simpleVisualization.columns,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={simpleData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'simple - avg totalAggregationType columns',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...avgVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            colTotals: true,
            hideEmptyRows: true,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={avgData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'simple - avg totalAggregationType rows',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...avgVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            columns: avgVisualization.rows,
            rows: avgVisualization.columns,
            rowTotals: true,
            hideEmptyColumns: true,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={avgData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add('deep', (_, { pivotTableOptions }) => {
    const visualization = {
        ...deepVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
        showDimensionLabels: false,
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={deepData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add(
    'deep - filter',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...deepWithFiltersVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            showDimensionLabels: false,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={deepWithFiltersData}
                    visualization={visualization}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'deep - title / subtitle / filter',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...deepVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            showDimensionLabels: false,
            title: 'This is a Table',
            subtitle: "It's a rather big table",
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={deepData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'deep - dimension labels',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...deepVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={deepData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'deep - small / compact',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...deepVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            displayDensity: 'COMPACT',
            fontSize: 'SMALL',
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={deepData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'deep - large / comfortable',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...deepVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            displayDensity: 'COMFORTABLE',
            fontSize: 'LARGE',
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={deepData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'deep - row %',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...deepVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            numberType: NUMBER_TYPE_ROW_PERCENTAGE,
            colSubTotals: true,
            rowSubTotals: true,
            rowTotals: true,
            colTotals: true,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={deepData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'deep - column %',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...deepVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            numberType: NUMBER_TYPE_COLUMN_PERCENTAGE,
            colSubTotals: true,
            rowSubTotals: true,
            rowTotals: true,
            colTotals: true,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={deepData} visualization={visualization} />
            </div>
        )
    }
)

const ResizingPivotTable = ({ visualization }) => {
    const [size, setSize] = useState(() => ({ width: 400, height: 300 }))

    useEffect(() => {
        const bound = 150
        let step = 1
        let delta = 0
        const interval = setInterval(() => {
            if (delta < 0 || delta >= bound) {
                step *= -1
            }
            delta += step
            setSize({
                width: 400 + delta * 4,
                height: 300 + delta * 3,
            })
        }, 10)
        return () => clearInterval(interval)
    }, [])
    return (
        <div style={size}>
            <PivotTable data={deepData} visualization={visualization} />
        </div>
    )
}
ResizingPivotTable.propTypes = {
    visualization: PropTypes.object.isRequired,
}

storiesOf('PivotTable', module).add(
    'deep - resize',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...deepVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
        }
        return <ResizingPivotTable visualization={visualization} />
    }
)

storiesOf('PivotTable', module).add(
    'deep - totals',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...deepVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            rowTotals: true,
            colTotals: true,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={deepData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'deep - subtotals',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...deepVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            rowSubTotals: true,
            colSubTotals: true,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={deepData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'deep - all totals',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...deepVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            rowSubTotals: true,
            colSubTotals: true,
            rowTotals: true,
            colTotals: true,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={deepData} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'small empty rows - shown',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...diseaseWeeksVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            colTotals: true,
            rowTotals: true,
            colSubTotals: true,
            rowSubTotals: true,
        }

        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={diseaseWeeksData}
                    visualization={visualization}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'small empty rows - hidden',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...diseaseWeeksVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            colTotals: true,
            rowTotals: true,
            colSubTotals: true,
            rowSubTotals: true,
            hideEmptyRows: true,
        }

        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={diseaseWeeksData}
                    visualization={visualization}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'empty rows - shown',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...emptyRowsVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            rowSubTotals: true,
            colSubTotals: true,
            rowTotals: true,
            colTotals: true,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={emptyRowsData}
                    visualization={visualization}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'empty rows - hidden',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...emptyRowsVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            hideEmptyRows: true,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={emptyRowsData}
                    visualization={visualization}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'empty columns - shown',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...lastFiveYearsVisualization,
            ...pivotTableOptions,
            hideEmptyColumns: false,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={lastFiveYearsData}
                    visualization={visualization}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'empty columns - hidden',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...lastFiveYearsVisualization,
            ...pivotTableOptions,
            hideEmptyColumns: true,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={lastFiveYearsData}
                    visualization={visualization}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'empty columns (weekly) - shown',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...weeklyColumnsVisualization,
            ...pivotTableOptions,
            hideEmptyColumns: false,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={weeklyColumnsData}
                    visualization={visualization}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'empty columns (weekly) - hidden',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...weeklyColumnsVisualization,
            ...pivotTableOptions,
            hideEmptyColumns: true,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={weeklyColumnsData}
                    visualization={visualization}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'empty columns + assigned cats (shown)',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...emptyColumnsVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            hideEmptyColumns: false,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={emptyColumnsData}
                    visualization={visualization}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'empty columns + assigned cats (hidden)',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...emptyColumnsVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            hideEmptyColumns: true,
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={emptyColumnsData}
                    visualization={visualization}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'legend - fixed (light fill)',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...targetVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            rowSubTotals: true,
            colSubTotals: true,
            rowTotals: true,
            colTotals: true,
            legendDisplayStyle: 'FILL',
            legendSet: {
                id: underAbove100LegendSet.id,
            },
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={targetData}
                    visualization={visualization}
                    legendSets={[underAbove100LegendSet]}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'legend - fixed (dark fill)',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...targetVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            rowSubTotals: true,
            colSubTotals: true,
            legendDisplayStyle: 'FILL',
            legendSet: {
                id: underAbove100LegendSet.id,
            },
        }

        const legendSet = cloneDeep(underAbove100LegendSet)
        legendSet.legends[0].color = '#000000'
        legendSet.legends[1].color = '#666666'

        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={targetData}
                    visualization={visualization}
                    legendSets={[legendSet]}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'legend - fixed (text)',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...targetVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            legendDisplayStyle: 'TEXT',
            legendSet: {
                id: underAbove100LegendSet.id,
            },
        }
        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={targetData}
                    visualization={visualization}
                    legendSets={[underAbove100LegendSet]}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'legend - fixed (% row)',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...targetVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            rowSubTotals: true,
            colSubTotals: true,
            numberType: NUMBER_TYPE_ROW_PERCENTAGE,
            legendDisplayStyle: 'FILL',
            legendSet: {
                id: underAbove100LegendSet.id,
            },
        }

        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={targetData}
                    visualization={visualization}
                    legendSets={[underAbove100LegendSet]}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'legend - by data item',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...targetVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            rowSubTotals: true,
            colSubTotals: true,
            legendDisplayStrategy: 'BY_DATA_ITEM',
            legendSet: undefined,
        }
        const data = cloneDeep(targetData)

        const customLegendSet = cloneDeep(underAbove100LegendSet)
        customLegendSet.id = 'TESTID'
        customLegendSet.legends[0].color = '#000000'
        customLegendSet.legends[1].color = '#666666'

        data.metaData.items[visualization.columns[0].items[1].id].legendSet =
            underAbove100LegendSet.id
        data.metaData.items[visualization.columns[0].items[3].id].legendSet =
            customLegendSet.id

        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={data}
                    visualization={visualization}
                    legendSets={[underAbove100LegendSet, customLegendSet]}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'hierarchy - none',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...hierarchyVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            showHierarchy: false,
            colTotals: true,
            rowTotals: true,
            colSubTotals: true,
            rowSubTotals: true,
        }

        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={hierarchyData}
                    visualization={visualization}
                />
            </div>
        )
    }
)
storiesOf('PivotTable', module).add(
    'hierarchy - rows',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...hierarchyVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            colTotals: true,
            rowTotals: true,
            colSubTotals: true,
            rowSubTotals: true,
        }

        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={hierarchyData}
                    visualization={visualization}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add(
    'hierarchy - columns',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...hierarchyVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            columns: hierarchyVisualization.rows,
            rows: hierarchyVisualization.columns,
            colTotals: true,
            rowTotals: true,
            colSubTotals: true,
            rowSubTotals: true,
        }

        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable
                    data={hierarchyData}
                    visualization={visualization}
                />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add('narrative', (_, { pivotTableOptions }) => {
    const visualization = {
        ...narrativeVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
        rowTotals: true,
        colTotals: true,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={narrativeData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add(
    'narrative - data as filter',
    (_, { pivotTableOptions }) => {
        const visualization = {
            ...narrativeVisualization,
            ...visualizationReset,
            ...pivotTableOptions,
            columns: narrativeVisualization.filters,
            filters: narrativeVisualization.columns,
            rowTotals: true,
            colTotals: true,
        }

        const data = {
            ...narrativeData,
            rows: [narrativeData.rows[0]],
        }

        return (
            <div style={{ width: 800, height: 600 }}>
                <PivotTable data={data} visualization={visualization} />
            </div>
        )
    }
)

storiesOf('PivotTable', module).add('DEGS', (_, { pivotTableOptions }) => {
    const visualization = {
        ...degsVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={degsData} visualization={visualization} />
        </div>
    )
})
