import React from 'react'
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