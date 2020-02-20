import React, { useState, useEffect } from 'react'
import { storiesOf } from '@storybook/react'
import cloneDeep from 'lodash/cloneDeep'

import PivotTable from '../src/components/PivotTable/PivotTable'

import deepData from './data/deep.data.json'
import deepVisualization from './data/deep.visualization.json'
import deepLegendSet from './data/deep.legendSet.json'

import emptyRowsData from './data/emptyRows.data.json'
import emptyRowsVisualization from './data/emptyRows.visualization.json'

const visualizationReset = {
    colTotals: false,
    rowTotals: false,
    colSubTotals: false,
    rowSubTotals: false,
    hideEmptyColumns: false,
    hideEmptyRows: false
}

storiesOf('PivotTable', module).add('default', () => {
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
storiesOf('PivotTable', module).add('resize', () => {
    const visualization = {
        ...deepVisualization,
        ...visualizationReset
    }
    return <ResizingPivotTable visualization={visualization} />
})

storiesOf('PivotTable', module).add('totals', () => {
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

storiesOf('PivotTable', module).add('subtotals', () => {
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

storiesOf('PivotTable', module).add('empty rows (shown)', () => {
    const visualization = {
        ...emptyRowsVisualization,
        ...visualizationReset
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={emptyRowsData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('empty rows (hidden)', () => {
    const visualization = {
        ...emptyRowsVisualization,
        ...visualizationReset,
        hideEmptyRows: true
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={emptyRowsData} visualization={visualization} />
        </div>
    )
})

storiesOf('PivotTable', module).add('Fixed legendSet (light fill)', () => {
    const visualization = {
        ...deepVisualization,
        ...visualizationReset,
        rowSubTotals: true,
        colSubTotals: true,
        legendDisplayStyle: 'FILL',
        legendSet: {
            id: deepLegendSet.id
        },
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={deepData} visualization={visualization} legendSets={[deepLegendSet]} />
        </div>
    )
})

storiesOf('PivotTable', module).add('Fixed legendSet (dark fill)', () => {
    const visualization = {
        ...deepVisualization,
        ...visualizationReset,
        rowSubTotals: true,
        colSubTotals: true,
        legendDisplayStyle: 'FILL',
        legendSet: {
            id: deepLegendSet.id
        },
    }

    const legendSet = cloneDeep(deepLegendSet)
    legendSet.legends[0].color = '#000000'
    legendSet.legends[1].color = '#666666'

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={deepData} visualization={visualization} legendSets={[legendSet]} />
        </div>
    )
})

storiesOf('PivotTable', module).add('Fixed legendSet (text)', () => {
    const visualization = {
        ...deepVisualization,
        ...visualizationReset,
        rowSubTotals: true,
        colSubTotals: true,
        legendDisplayStyle: 'TEXT',
        legendSet: {
            id: deepLegendSet.id
        },
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={deepData} visualization={visualization} legendSets={[deepLegendSet]} />
        </div>
    )
})

storiesOf('PivotTable', module).add('By DX legendSet !!UNIMPLEMENTED!!', () => {
    const visualization = {
        ...deepVisualization,
        ...visualizationReset,
        rowSubTotals: true,
        colSubTotals: true,
    }
    const data = {
        ...deepData
    }

    data.metaData.items[visualization.rows[0].items[1].id].legendSet = {
        id: deepLegendSet.id
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={deepData} visualization={visualization} legendSets={[deepLegendSet]} />
        </div>
    )
})