import { Checkbox, Divider } from '@dhis2/ui'
import cloneDeep from 'lodash/cloneDeep'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { PivotTable } from '../index.js'
import {
    NUMBER_TYPE_COLUMN_PERCENTAGE,
    NUMBER_TYPE_ROW_PERCENTAGE,
} from '../modules/pivotTable/pivotTableConstants.js'
import avgDataResponse from './data/aggregate/avgTotalAggregationType.data.json'
import avgMetadataResponse from './data/aggregate/avgTotalAggregationType.metadata.json'
import avgVisualization from './data/aggregate/avgTotalAggregationType.visualization.json'
import deepData from './data/aggregate/deep.data.json'
import deepVisualization from './data/aggregate/deep.visualization.json'
import deepWithFiltersData from './data/aggregate/deepWithFilters.data.json'
import deepWithFiltersVisualization from './data/aggregate/deepWithFilters.visualization.json'
import degsDataResponse from './data/aggregate/degs.data.json'
import degsMetadataResponse from './data/aggregate/degs.metadata.json'
import degsVisualization from './data/aggregate/degs.visualization.json'
import diseaseWeeksDataResponse from './data/aggregate/diseaseWeeks.data.json'
import diseaseWeeksMetadataResponse from './data/aggregate/diseaseWeeks.metadata.json'
import diseaseWeeksVisualization from './data/aggregate/diseaseWeeks.visualization.json'
import emptyColumnsDataResponse from './data/aggregate/emptyColumns.data.json'
import emptyColumnsMetadataResponse from './data/aggregate/emptyColumns.metadata.json'
import emptyColumnsVisualization from './data/aggregate/emptyColumns.visualization.json'
import emptyRowsData from './data/aggregate/emptyRows.data.json'
import emptyRowsVisualization from './data/aggregate/emptyRows.visualization.json'
import hierarchyDataResponse from './data/aggregate/hierarchy.data.json'
import hierarchyMetadataResponse from './data/aggregate/hierarchy.metadata.json'
import hierarchyVisualization from './data/aggregate/hierarchy.visualization.json'
import lastFiveYearsDataResponse from './data/aggregate/lastFiveYears.data.json'
import lastFiveYearsMetadataResponse from './data/aggregate/lastFiveYears.metadata.json'
import lastFiveYearsVisualization from './data/aggregate/lastFiveYears.visualization.json'
import narrativeDataResponse from './data/aggregate/narrative.data.json'
import narrativeMetadataResponse from './data/aggregate/narrative.metadata.json'
import narrativeVisualization from './data/aggregate/narrative.visualization.json'
import simpleDataResponse from './data/aggregate/simple.data.json'
import simpleMetadataResponse from './data/aggregate/simple.metadata.json'
import simpleVisualization from './data/aggregate/simple.visualization.json'
import targetDataResponse from './data/aggregate/target-with-legend.data.json'
import targetMetadataResponse from './data/aggregate/target-with-legend.metadata.json'
import targetVisualization from './data/aggregate/target-with-legend.visualization.json'
import underAbove100LegendSet from './data/aggregate/under-above-100.legendSet.json'
import weeklyColumnsDataResponse from './data/aggregate/weeklyColumns.data.json'
import weeklyColumnsMetadataResponse from './data/aggregate/weeklyColumns.metadata.json'
import weeklyColumnsVisualization from './data/aggregate/weeklyColumns.visualization.json'

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

export default {
    title: 'PivotTable (aggregate)',
    decorators: [PivotTableOptionsWrapper],
}

export const Simple = (_, { pivotTableOptions }) => {
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
}

Simple.story = {
    name: 'simple',
}

export const SimpleCommaDgs = (_, { pivotTableOptions }) => {
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

SimpleCommaDgs.story = {
    name: 'simple - comma DGS',
}

export const SimpleTitleSubtitleFilter = (_, { pivotTableOptions }) => {
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

SimpleTitleSubtitleFilter.story = {
    name: 'simple - title / subtitle / filter',
}

export const SimpleColumn = (_, { pivotTableOptions }) => {
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

SimpleColumn.story = {
    name: 'simple - column %',
}

export const SimpleRow = (_, { pivotTableOptions }) => {
    const visualization = {
        ...diseaseWeeksVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
        numberType: NUMBER_TYPE_ROW_PERCENTAGE,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={diseaseWeeksData} visualization={visualization} />
        </div>
    )
}

SimpleRow.story = {
    name: 'simple - row %',
}

export const SimpleDataAsFilter = (_, { pivotTableOptions }) => {
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

SimpleDataAsFilter.story = {
    name: 'simple - data as filter',
}

export const SimpleNoColumns = (_, { pivotTableOptions }) => {
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

SimpleNoColumns.story = {
    name: 'simple - no columns',
}

export const SimpleNoColumnsSingleCell = (_, { pivotTableOptions }) => {
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

SimpleNoColumnsSingleCell.story = {
    name: 'simple - no columns (single cell)',
}

export const SimpleNoColumnsDeep = (_, { pivotTableOptions }) => {
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

SimpleNoColumnsDeep.story = {
    name: 'simple - no columns (deep)',
}

export const SimpleNoColumnsLabel = (_, { pivotTableOptions }) => {
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

SimpleNoColumnsLabel.story = {
    name: 'simple - no columns (label)',
}

export const SimpleNoRowsSmall = (_, { pivotTableOptions }) => {
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

SimpleNoRowsSmall.story = {
    name: 'simple - no rows (small)',
}

export const SimpleNoRowsLarge = (_, { pivotTableOptions }) => {
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

SimpleNoRowsLarge.story = {
    name: 'simple - no rows (large)',
}

export const SimpleAvgTotalAggregationTypeColumns = (
    _,
    { pivotTableOptions }
) => {
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

SimpleAvgTotalAggregationTypeColumns.story = {
    name: 'simple - avg totalAggregationType columns',
}

export const SimpleAvgTotalAggregationTypeRows = (_, { pivotTableOptions }) => {
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

SimpleAvgTotalAggregationTypeRows.story = {
    name: 'simple - avg totalAggregationType rows',
}

export const Deep = (_, { pivotTableOptions }) => {
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
}

Deep.story = {
    name: 'deep',
}

export const DeepFilter = (_, { pivotTableOptions }) => {
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

DeepFilter.story = {
    name: 'deep - filter',
}

export const DeepTitleSubtitleFilter = (_, { pivotTableOptions }) => {
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

DeepTitleSubtitleFilter.story = {
    name: 'deep - title / subtitle / filter',
}

export const DeepDimensionLabels = (_, { pivotTableOptions }) => {
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

DeepDimensionLabels.story = {
    name: 'deep - dimension labels',
}

export const DeepSmallCompact = (_, { pivotTableOptions }) => {
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

DeepSmallCompact.story = {
    name: 'deep - small / compact',
}

export const DeepLargeComfortable = (_, { pivotTableOptions }) => {
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

DeepLargeComfortable.story = {
    name: 'deep - large / comfortable',
}

export const DeepRow = (_, { pivotTableOptions }) => {
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

DeepRow.story = {
    name: 'deep - row %',
}

export const DeepColumn = (_, { pivotTableOptions }) => {
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

DeepColumn.story = {
    name: 'deep - column %',
}

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

export const DeepResize = (_, { pivotTableOptions }) => {
    const visualization = {
        ...deepVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }
    return <ResizingPivotTable visualization={visualization} />
}

DeepResize.story = {
    name: 'deep - resize',
}

export const DeepTotals = (_, { pivotTableOptions }) => {
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

DeepTotals.story = {
    name: 'deep - totals',
}

export const DeepSubtotals = (_, { pivotTableOptions }) => {
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

DeepSubtotals.story = {
    name: 'deep - subtotals',
}

export const DeepAllTotals = (_, { pivotTableOptions }) => {
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

DeepAllTotals.story = {
    name: 'deep - all totals',
}

export const SmallEmptyRowsShown = (_, { pivotTableOptions }) => {
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
            <PivotTable data={diseaseWeeksData} visualization={visualization} />
        </div>
    )
}

SmallEmptyRowsShown.story = {
    name: 'small empty rows - shown',
}

export const SmallEmptyRowsHidden = (_, { pivotTableOptions }) => {
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
            <PivotTable data={diseaseWeeksData} visualization={visualization} />
        </div>
    )
}

SmallEmptyRowsHidden.story = {
    name: 'small empty rows - hidden',
}

export const EmptyRowsShown = (_, { pivotTableOptions }) => {
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
            <PivotTable data={emptyRowsData} visualization={visualization} />
        </div>
    )
}

EmptyRowsShown.story = {
    name: 'empty rows - shown',
}

export const EmptyRowsHidden = (_, { pivotTableOptions }) => {
    const visualization = {
        ...emptyRowsVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
        hideEmptyRows: true,
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={emptyRowsData} visualization={visualization} />
        </div>
    )
}

EmptyRowsHidden.story = {
    name: 'empty rows - hidden',
}

export const EmptyColumnsShown = (_, { pivotTableOptions }) => {
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

EmptyColumnsShown.story = {
    name: 'empty columns - shown',
}

export const EmptyColumnsHidden = (_, { pivotTableOptions }) => {
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

EmptyColumnsHidden.story = {
    name: 'empty columns - hidden',
}

export const EmptyColumnsWeeklyShown = (_, { pivotTableOptions }) => {
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

EmptyColumnsWeeklyShown.story = {
    name: 'empty columns (weekly) - shown',
}

export const CumulativeEmptyColumnsWeeklyShown = (_, { pivotTableOptions }) => {
    const visualization = {
        ...weeklyColumnsVisualization,
        ...pivotTableOptions,
        hideEmptyColumns: false,
        cumulativeValues: true,
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

CumulativeEmptyColumnsWeeklyShown.story = {
    name: 'cumulative + empty columns (weekly) - shown',
}

export const EmptyColumnsWeeklyHidden = (_, { pivotTableOptions }) => {
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

EmptyColumnsWeeklyHidden.story = {
    name: 'empty columns (weekly) - hidden',
}

export const CumulativeEmptyColumnsWeeklyHidden = (
    _,
    { pivotTableOptions }
) => {
    const visualization = {
        ...weeklyColumnsVisualization,
        ...pivotTableOptions,
        hideEmptyColumns: true,
        cumulativeValues: true,
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

CumulativeEmptyColumnsWeeklyHidden.story = {
    name: 'cumulative + empty columns (weekly) - hidden',
}

export const EmptyColumnsAssignedCatsShown = (_, { pivotTableOptions }) => {
    const visualization = {
        ...emptyColumnsVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
        hideEmptyColumns: false,
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={emptyColumnsData} visualization={visualization} />
        </div>
    )
}

EmptyColumnsAssignedCatsShown.story = {
    name: 'empty columns + assigned cats (shown)',
}

export const EmptyColumnsAssignedCatsHidden = (_, { pivotTableOptions }) => {
    const visualization = {
        ...emptyColumnsVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
        hideEmptyColumns: true,
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={emptyColumnsData} visualization={visualization} />
        </div>
    )
}

EmptyColumnsAssignedCatsHidden.story = {
    name: 'empty columns + assigned cats (hidden)',
}

export const LegendFixedLightFill = (_, { pivotTableOptions }) => {
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

LegendFixedLightFill.story = {
    name: 'legend - fixed (light fill)',
}

export const LegendFixedDarkFill = (_, { pivotTableOptions }) => {
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

LegendFixedDarkFill.story = {
    name: 'legend - fixed (dark fill)',
}

export const LegendFixedText = (_, { pivotTableOptions }) => {
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

LegendFixedText.story = {
    name: 'legend - fixed (text)',
}

export const LegendFixedRow = (_, { pivotTableOptions }) => {
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

LegendFixedRow.story = {
    name: 'legend - fixed (% row)',
}

export const LegendByDataItem = (_, { pivotTableOptions }) => {
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

LegendByDataItem.story = {
    name: 'legend - by data item',
}

export const HierarchyNone = (_, { pivotTableOptions }) => {
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
            <PivotTable data={hierarchyData} visualization={visualization} />
        </div>
    )
}

HierarchyNone.story = {
    name: 'hierarchy - none',
}

export const HierarchyRows = (_, { pivotTableOptions }) => {
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
            <PivotTable data={hierarchyData} visualization={visualization} />
        </div>
    )
}

HierarchyRows.story = {
    name: 'hierarchy - rows',
}

export const HierarchyColumns = (_, { pivotTableOptions }) => {
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
            <PivotTable data={hierarchyData} visualization={visualization} />
        </div>
    )
}

HierarchyColumns.story = {
    name: 'hierarchy - columns',
}

export const Narrative = (_, { pivotTableOptions }) => {
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
}

Narrative.story = {
    name: 'narrative',
}

export const NarrativeDataAsFilter = (_, { pivotTableOptions }) => {
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

NarrativeDataAsFilter.story = {
    name: 'narrative - data as filter',
}

export const Degs = (_, { pivotTableOptions }) => {
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
}

Degs.story = {
    name: 'DEGS',
}

export const TruncatedHeaderCell = (_, { pivotTableOptions }) => {
    const widths = [250, 200, 500]
    const [width, setWidth] = useState(250)
    const toggleWidth = () =>
        setWidth(
            (currentWidth) =>
                widths[widths.indexOf(currentWidth) + 1] ?? widths[0]
        )
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
        <div
            style={{
                width,
                height: 600,
                marginTop: 50,
                transition: 'width 1s',
            }}
        >
            <button onClick={toggleWidth}>Toggle width</button>
            <PivotTable data={data} visualization={visualization} />
        </div>
    )
}

TruncatedHeaderCell.story = {
    name: 'Truncated header cell',
}
