import React, { useState, useEffect } from 'react'
import { storiesOf } from '@storybook/react'
import cloneDeep from 'lodash/cloneDeep'

import PivotTable from '../src/components/PivotTable/PivotTable'

import simpleMetadataResponse from './data/simple.metadata.json'
import simpleDataResponse from './data/simple.data.json'
import simpleVisualization from './data/simple.visualization.json'

import deepData from './data/deep.data.json'
import deepVisualization from './data/deep.visualization.json'

import emptyRowsData from './data/emptyRows.data.json'
import emptyRowsVisualization from './data/emptyRows.visualization.json'

import emptyColumnsDataResponse from './data/emptyColumns.data.json'
import emptyColumnsMetadataResponse from './data/emptyColumns.metadata.json'
import emptyColumnsVisualization from './data/emptyColumns.visualization.json'

import targetDataResponse from './data/target-with-legend.data.json'
import targetMetadataResponse from './data/target-with-legend.metadata.json'
import targetVisualization from './data/target-with-legend.visualization.json'

import hierarchyDataResponse from './data/hierarchy.data.json'
import hierarchyMetadataResponse from './data/hierarchy.metadata.json'
import hierarchyVisualization from './data/hierarchy.visualization.json'

import narrativeDataResponse from './data/narrative.data.json'
import narrativeMetadataResponse from './data/narrative.metadata.json'
import narrativeVisualization from './data/narrative.visualization.json'

import degsDataResponse from './data/degs.data.json'
import degsMetadataResponse from './data/degs.metadata.json'
import degsVisualization from './data/degs.visualization.json'

import diseaseWeeksDataResponse from './data/diseaseWeeks.data.json'
import diseaseWeeksMetadataResponse from './data/diseaseWeeks.metadata.json'
import diseaseWeeksVisualization from './data/diseaseWeeks.visualization.json'

import underAbove100LegendSet from './data/under-above-100.legendSet.json'
import { NUMBER_TYPE_COLUMN_PERCENTAGE, NUMBER_TYPE_ROW_PERCENTAGE } from '../src/modules/pivotTable/pivotTableConstants'

const visualizationReset = {
    colTotals: false,
    rowTotals: false,
    colSubTotals: false,
    rowSubTotals: false,
    hideEmptyColumns: false,
    hideEmptyRows: false
}

const combineDataWithMetadata = (dataResponse, metadataResponse) => ({
    ...dataResponse,
    metaData: metadataResponse.metaData
})

const simpleData = combineDataWithMetadata(simpleDataResponse, simpleMetadataResponse)
const emptyColumnsData = combineDataWithMetadata(emptyColumnsDataResponse, emptyColumnsMetadataResponse)
const targetData = combineDataWithMetadata(targetDataResponse, targetMetadataResponse)
const hierarchyData = combineDataWithMetadata(hierarchyDataResponse, hierarchyMetadataResponse)
const narrativeData = combineDataWithMetadata(narrativeDataResponse, narrativeMetadataResponse)
const degsData = combineDataWithMetadata(degsDataResponse, degsMetadataResponse)
const diseaseWeeksData = combineDataWithMetadata(diseaseWeeksDataResponse, diseaseWeeksMetadataResponse)


storiesOf('PivotTable', module).add('simple', () => {
    const visualization = {
        ...simpleVisualization,
        ...visualizationReset
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={simpleData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('simple - title / subtitle / filter', () => {
    const visualization = {
        ...simpleVisualization,
        ...visualizationReset,
        title: 'This is a Table',
        subtitle: 'It\'s not a very big table'
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={simpleData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('simple - column %', () => {
    const visualization = {
        ...simpleVisualization,
        ...visualizationReset,
        colTotals: true,
        numberType: NUMBER_TYPE_COLUMN_PERCENTAGE
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={simpleData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('simple - data as filter', () => {
    const visualization = {
        ...simpleVisualization,
        ...visualizationReset,
        columns: simpleVisualization.filters,
        filters: simpleVisualization.columns
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={simpleData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('simple - no columns', () => {
    const visualization = {
        ...simpleVisualization,
        ...visualizationReset,
        columns: [],
        filters: simpleVisualization.columns
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={simpleData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('simple - no rows', () => {
    const visualization = {
        ...simpleVisualization,
        ...visualizationReset,
        rows: [],
        columns: simpleVisualization.filters,
        filters: simpleVisualization.columns
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={simpleData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('deep', () => {
    const visualization = {
        ...deepVisualization,
        ...visualizationReset,
        showDimensionLabels: false
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={deepData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('deep - dimension labels', () => {
    const visualization = {
        ...deepVisualization,
        ...visualizationReset
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={deepData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('deep - small / compact', () => {
    const visualization = {
        ...deepVisualization,
        ...visualizationReset,
        displayDensity: 'COMPACT',
        fontSize: 'SMALL'
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={deepData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('deep - large / comfortable', () => {
    const visualization = {
        ...deepVisualization,
        ...visualizationReset,
        displayDensity: 'COMFORTABLE',
        fontSize: 'LARGE'
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={deepData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('deep - row %', () => {
    const visualization = {
        ...deepVisualization,
        ...visualizationReset,
        numberType: NUMBER_TYPE_ROW_PERCENTAGE,
        colSubTotals: true,
        rowSubTotals: true,
        rowTotals: true,
        colTotals: true
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={deepData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('deep - column %', () => {
    const visualization = {
        ...deepVisualization,
        ...visualizationReset,
        numberType: NUMBER_TYPE_COLUMN_PERCENTAGE,
        colSubTotals: true,
        rowSubTotals: true,
        rowTotals: true,
        colTotals: true
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={deepData} visualization={visualization} />
        </div>
    )
})

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
            delta += step;
            setSize({
                width: 400 + delta * 4,
                height: 300 + delta * 3
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
storiesOf('PivotTable', module).add('deep - resize', () => {
    const visualization = {
        ...deepVisualization,
        ...visualizationReset
    }
    return <ResizingPivotTable visualization={visualization} />
})

storiesOf('PivotTable', module).add('deep - totals', () => {
    const visualization = {
        ...deepVisualization,
        ...visualizationReset,
        rowTotals: true,
        colTotals: true
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={deepData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('deep - subtotals', () => {
    const visualization = {
        ...deepVisualization,
        ...visualizationReset,
        rowSubTotals: true,
        colSubTotals: true
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={deepData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('deep - all totals', () => {
    const visualization = {
        ...deepVisualization,
        ...visualizationReset,
        rowSubTotals: true,
        colSubTotals: true,
        rowTotals: true,
        colTotals: true
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={deepData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('small empty rows - shown', () => {
    const visualization = {
        ...diseaseWeeksVisualization,
        ...visualizationReset,
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
})

storiesOf('PivotTable', module).add('small empty rows - hidden', () => {
    const visualization = {
        ...diseaseWeeksVisualization,
        ...visualizationReset,
        colTotals: true,
        rowTotals: true,
        colSubTotals: true,
        rowSubTotals: true,
        hideEmptyRows: true
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={diseaseWeeksData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('empty rows - shown', () => {
    const visualization = {
        ...emptyRowsVisualization,
        ...visualizationReset,
        rowSubTotals: true,
        colSubTotals: true,
        rowTotals: true,
        colTotals: true
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={emptyRowsData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('empty rows - hidden', () => {
    const visualization = {
        ...emptyRowsVisualization,
        ...visualizationReset,
        hideEmptyRows: true,
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={emptyRowsData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('empty columns + assigned cats (shown)', () => {
    const visualization = {
        ...emptyColumnsVisualization,
        ...visualizationReset,
        hideEmptyColumns: false
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={emptyColumnsData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('empty columns + assigned cats (hidden)', () => {
    const visualization = {
        ...emptyColumnsVisualization,
        ...visualizationReset,
        hideEmptyColumns: true
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={emptyColumnsData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('legend - fixed (light fill)', () => {
    const visualization = {
        ...targetVisualization,
        ...visualizationReset,
        rowSubTotals: true,
        colSubTotals: true,
        rowTotals: true,
        colTotals: true,
        legendDisplayStyle: 'FILL',
        legendSet: {
            id: underAbove100LegendSet.id
        },
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={targetData} visualization={visualization} legendSets={[underAbove100LegendSet]} />
        </div>
    )
})

storiesOf('PivotTable', module).add('legend - fixed (dark fill)', () => {
    const visualization = {
        ...targetVisualization,
        ...visualizationReset,
        rowSubTotals: true,
        colSubTotals: true,
        legendDisplayStyle: 'FILL',
        legendSet: {
            id: underAbove100LegendSet.id
        },
    }

    const legendSet = cloneDeep(underAbove100LegendSet)
    legendSet.legends[0].color = '#000000'
    legendSet.legends[1].color = '#666666'

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={targetData} visualization={visualization} legendSets={[legendSet]} />
        </div>
    )
})

storiesOf('PivotTable', module).add('legend - fixed (text)', () => {
    const visualization = {
        ...targetVisualization,
        ...visualizationReset,
        legendDisplayStyle: 'TEXT',
        legendSet: {
            id: underAbove100LegendSet.id
        },
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={targetData} visualization={visualization} legendSets={[underAbove100LegendSet]} />
        </div>
    )
})

storiesOf('PivotTable', module).add('legend - by data item', () => {
    const visualization = {
        ...targetVisualization,
        ...visualizationReset,
        rowSubTotals: true,
        colSubTotals: true,
        legendDisplayStrategy: 'BY_DATA_ITEM',
        legendSet: undefined
    }
    const data = {
        ...targetData
    }

    const customLegendSet = cloneDeep(underAbove100LegendSet)
    customLegendSet.id = 'TESTID'
    customLegendSet.legends[0].color = '#000000'
    customLegendSet.legends[1].color = '#666666'

    data.metaData.items[visualization.columns[0].items[1].id].legendSet = underAbove100LegendSet.id
    data.metaData.items[visualization.columns[0].items[3].id].legendSet = customLegendSet.id

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={targetData} visualization={visualization} legendSets={[underAbove100LegendSet, customLegendSet]} />
        </div>
    )
})

storiesOf('PivotTable', module).add('hierarchy - shown', () => {
    const visualization = {
        ...hierarchyVisualization,
        ...visualizationReset,
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
})

storiesOf('PivotTable', module).add('narrative', () => {
    const visualization = {
        ...narrativeVisualization,
        ...visualizationReset,
        rowTotals: true,
        colTotals: true,
    }
    
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={narrativeData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('narrative - data as filter', () => {
    const visualization = {
        ...narrativeVisualization,
        ...visualizationReset,
        columns: narrativeVisualization.filters,
        filters: narrativeVisualization.columns,
        rowTotals: true,
        colTotals: true,
    }

    const data = {
        ...narrativeData,
        rows: [
            narrativeData.rows[0]
        ]
    }
    
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={data} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('DEGS', () => {
    const visualization = {
        ...degsVisualization,
        ...visualizationReset
    }
    
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={degsData} visualization={visualization} />
        </div>
    )
})