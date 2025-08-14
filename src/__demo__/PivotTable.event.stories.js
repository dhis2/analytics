import { Checkbox, Divider } from '@dhis2/ui'
import React, { useState } from 'react'
import { PivotTable } from '../index.js'
import booleanData from './data/event/boolean.data.json'
import booleanVisualization from './data/event/boolean.visualization.json'
import dateData from './data/event/date.data.json'
import dateVisualization from './data/event/date.visualization.json'
import numericLegendsetData from './data/event/numeric-legendset.data.json'
import numericLegendsetVisualization from './data/event/numeric-legendset.visualization.json'
import numericData from './data/event/numeric.data.json'
import numericVisualization from './data/event/numeric.visualization.json'
import optionsetData from './data/event/optionset.data.json'
import optionsetVisualization from './data/event/optionset.visualization.json'
import optionsetsData from './data/event/optionsets.data.json'
import optionsetsVisualization from './data/event/optionsets.visualization.json'
import yesonlyData from './data/event/yesonly.data.json'
import yesonlyVisualization from './data/event/yesonly.visualization.json'

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

export const Date = (_, { pivotTableOptions }) => {
    const visualization = {
        ...dateVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={dateData} visualization={visualization} />
        </div>
    )
}

Date.story = {
    name: 'Date',
}

export const Numeric = (_, { pivotTableOptions }) => {
    const visualization = {
        ...numericVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={numericData} visualization={visualization} />
        </div>
    )
}

Numeric.story = {
    name: 'Numeric',
}

export const NumericLegendset = (_, { pivotTableOptions }) => {
    const visualization = {
        ...numericLegendsetVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable
                data={numericLegendsetData}
                visualization={visualization}
            />
        </div>
    )
}

NumericLegendset.story = {
    name: 'Numeric with legendset',
}

export const Optionset = (_, { pivotTableOptions }) => {
    const visualization = {
        ...optionsetVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={optionsetData} visualization={visualization} />
        </div>
    )
}

Optionset.story = {
    name: 'Optionset',
}

export const OptionsetsNonUniqueCodes = (_, { pivotTableOptions }) => {
    const visualization = {
        ...optionsetsVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={optionsetsData} visualization={visualization} />
        </div>
    )
}

OptionsetsNonUniqueCodes.story = {
    name: 'Optionset, non-unique codes',
}

export const Boolean = (_, { pivotTableOptions }) => {
    const visualization = {
        ...booleanVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={booleanData} visualization={visualization} />
        </div>
    )
}

Boolean.story = {
    name: 'Boolean',
}

export const Yesonly = (_, { pivotTableOptions }) => {
    const visualization = {
        ...yesonlyVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={yesonlyData} visualization={visualization} />
        </div>
    )
}

Yesonly.story = {
    name: 'Boolean',
}
