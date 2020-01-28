import React, { useState, useEffect } from 'react'
import { storiesOf } from '@storybook/react'

import PivotTable from '../src/components/PivotTable/PivotTable'

import deepData from './data/deep.data.json'
import deepVisualization from './data/deep.visualization.json'

import emptyRowsData from './data/emptyRows.data.json'
import emptyRowsVisualization from './data/emptyRows.visualization.json'

storiesOf('PivotTable', module).add('default', () => {
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={deepData} visualization={deepVisualization} options={{}} />
        </div>
    )
})

const ResizingPivotTable = () => {
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
            <PivotTable data={deepData} visualization={deepVisualization} options={{ showRowTotals: true, showColumnTotals: true }} />
        </div>
    )
}
storiesOf('PivotTable', module).add('resize', () => {
    return <ResizingPivotTable />
})

storiesOf('PivotTable', module).add('totals', () => {
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={deepData} visualization={deepVisualization} options={{ showRowTotals: true, showColumnTotals: true }} />
        </div>
    )
})

storiesOf('PivotTable', module).add('subtotals', () => {
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={deepData} visualization={deepVisualization} options={{ showRowSubtotals: true, showColumnSubtotals: true }} />
        </div>
    )
})

storiesOf('PivotTable', module).add('empty rows (shown)', () => {
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={emptyRowsData} visualization={emptyRowsVisualization} options={{ hideEmptyRows: false }} />
        </div>
    )
})

storiesOf('PivotTable', module).add('empty rows (hidden)', () => {
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={emptyRowsData} visualization={emptyRowsVisualization} options={{ hideEmptyRows: true }} />
        </div>
    )
})