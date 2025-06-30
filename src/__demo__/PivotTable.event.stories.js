import { Checkbox, Divider } from '@dhis2/ui'
import React, { useState } from 'react'
import { PivotTable } from '../index.js'
import numericLegendsetData from './data/event/numeric-legendset.data.json'
import numericLegendsetVisualization from './data/event/numeric-legendset.visualization.json'
import numericData from './data/event/numeric.data.json'
import numericVisualization from './data/event/numeric.visualization.json'

const visualizationReset = {
    colTotals: false,
    rowTotals: false,
    colSubTotals: false,
    rowSubTotals: false,
    hideEmptyColumns: false,
    hideEmptyRows: false,
    hideNaData: false,
}

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
    title: 'PivotTable (event enrollment)',
    decorators: [PivotTableOptionsWrapper],
}


const getNumericItems = (rows, index) => [...new Set(rows.map(r => r[index]))].sort((a, b) => Number(a) - Number(b));

const getItemMetadata = items => items.reduce((md, item) => {
    md[item] = {
        name: item
    }
    return md
}, {})

const collectAndAddMetadata = (data, index) => {
    const modifiedData = {
        ...data
    }

    const headerId = data.headers[index].name

    // collect values and use as items
    const numericItems = getNumericItems(modifiedData.rows, index)
    modifiedData.metaData.dimensions[headerId] = numericItems

    // add metadata for numeric items
    modifiedData.metaData.items = {
        ...modifiedData.metaData.items,
        ...getItemMetadata(numericItems)
    }

    return modifiedData
}

export const NumericLegendset = (_, { pivotTableOptions }) => {
    const visualization = {
        ...numericLegendsetVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={numericLegendsetData} visualization={visualization} />
        </div>
    )
}

NumericLegendset.story = {
    name: 'Numeric with legendset',
}

export const Numeric = (_, { pivotTableOptions }) => {
    const visualization = {
        ...numericVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={collectAndAddMetadata(numericData, 0)} visualization={visualization} />
        </div>
    )
}

NumericLegendset.story = {
    name: 'Numeric with legendset',
}