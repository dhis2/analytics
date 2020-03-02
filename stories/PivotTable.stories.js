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

import targetDataResponse from './data/target-with-legend.data.json'
import targetMetadataResponse from './data/target-with-legend.metadata.json'
import targetVisualization from './data/target-with-legend.visualization.json'

import hierarchyDataResponse from './data/hierarchy.data.json'
import hierarchyMetadataResponse from './data/hierarchy.metadata.json'
import hierarchyVisualization from './data/hierarchy.visualization.json'

import underAbove100LegendSet from './data/under-above-100.legendSet.json'

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
const targetData = combineDataWithMetadata(targetDataResponse, targetMetadataResponse)
const hierarchyData = combineDataWithMetadata(hierarchyDataResponse, hierarchyMetadataResponse)

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

storiesOf('PivotTable', module).add('simple - column %', () => {
    const visualization = {
        ...simpleVisualization,
        ...visualizationReset,
        colTotals: true,
        numberType: 'COLUMN_PERCENTAGE'
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
        numberType: 'ROW_PERCENTAGE',
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
        numberType: 'COLUMN_PERCENTAGE',
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

// TODO: Text valueType story
// storiesOf('PivotTable', module).add('Text valueType', () => {
//     const visualization = {
//         ...targetVisualization,
//         ...visualizationReset,
//         rowSubTotals: true,
//         colSubTotals: true,
//         legendDisplayStrategy: 'BY_DATA_ITEM',
//         legendSet: undefined
//     }
//     const data = {
//         ...targetData
//     }

//     const customLegendSet = cloneDeep(underAbove100LegendSet)
//     customLegendSet.id = 'TESTID'
//     customLegendSet.legends[0].color = '#000000'
//     customLegendSet.legends[1].color = '#666666'

//     data.metaData.items[visualization.columns[0].items[1].id].legendSet = {
//         id: underAbove100LegendSet.id
//     }

//     data.metaData.items[visualization.columns[0].items[3].id].legendSet = {
//         id: customLegendSet.id
//     }

//     return (
//         <div style={{ width: 800, height: 600 }}>
//             <PivotTable data={targetData} visualization={visualization} legendSets={[underAbove100LegendSet, customLegendSet]} />
//         </div>
//     )
// })