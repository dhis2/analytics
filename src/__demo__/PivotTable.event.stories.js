import { Checkbox, Divider } from '@dhis2/ui'
import React, { useState } from 'react'
import { PivotTable } from '../index.js'
import booleanDataHideNa from './data/event/boolean.data.hidena.json'
import booleanData from './data/event/boolean.data.json'
import booleanVisualization from './data/event/boolean.visualization.json'
import dateDataHideNa from './data/event/date.data.hidena.json'
import dateData from './data/event/date.data.json'
import dateVisualization from './data/event/date.visualization.json'
import datetimeDataHideNa from './data/event/datetime.data.hidena.json'
import datetimeData from './data/event/datetime.data.json'
import datetimeVisualization from './data/event/datetime.visualization.json'
import emailDataHideNa from './data/event/email.data.hidena.json'
import emailData from './data/event/email.data.json'
import emailVisualization from './data/event/email.visualization.json'
import eventstatusDataHideNa from './data/event/eventstatus.data.hidena.json'
import eventstatusData from './data/event/eventstatus.data.json'
import eventstatusVisualization from './data/event/eventstatus.visualization.json'
import integerDataHideNa from './data/event/integer.data.hidena.json'
import integerData from './data/event/integer.data.json'
import integerVisualization from './data/event/integer.visualization.json'
import legendsetDataHideNa from './data/event/legendset.data.hidena.json'
import legendsetData from './data/event/legendset.data.json'
import legendsetVisualization from './data/event/legendset.visualization.json'
import optionsetDataHideNa from './data/event/optionset.data.hidena.json'
import optionsetData from './data/event/optionset.data.json'
import optionsetVisualization from './data/event/optionset.visualization.json'
import timeDataHideNa from './data/event/time.data.hidena.json'
import timeData from './data/event/time.data.json'
import timeVisualization from './data/event/time.visualization.json'
import yesonlyDataHideNa from './data/event/yesonly.data.hidena.json'
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
    title: 'PivotTable (event)',
    decorators: [PivotTableOptionsWrapper],
}

export const TypeBooleanNA = (_, { pivotTableOptions }) => {
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

TypeBooleanNA.storyName = 'Boolean N/A'

export const TypeBoolean = (_, { pivotTableOptions }) => {
    const visualization = {
        ...booleanVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable
                data={booleanDataHideNa}
                visualization={visualization}
            />
        </div>
    )
}

TypeBoolean.storyName = 'Boolean'

export const TypeDateNA = (_, { pivotTableOptions }) => {
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

TypeDateNA.storyName = 'Date N/A'

export const TypeDate = (_, { pivotTableOptions }) => {
    const visualization = {
        ...dateVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={dateDataHideNa} visualization={visualization} />
        </div>
    )
}

TypeDate.storyName = 'Date'

export const TypeDatetimeNA = (_, { pivotTableOptions }) => {
    const visualization = {
        ...datetimeVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={datetimeData} visualization={visualization} />
        </div>
    )
}

TypeDatetimeNA.storyName = 'Datetime N/A'

export const TypeDatetime = (_, { pivotTableOptions }) => {
    const visualization = {
        ...datetimeVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable
                data={datetimeDataHideNa}
                visualization={visualization}
            />
        </div>
    )
}

TypeDatetime.storyName = 'Datetime'

export const TypeLegendsetNA = (_, { pivotTableOptions }) => {
    const visualization = {
        ...legendsetVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={legendsetData} visualization={visualization} />
        </div>
    )
}

TypeLegendsetNA.storyName = 'Legendset N/A'

export const TypeLegendset = (_, { pivotTableOptions }) => {
    const visualization = {
        ...legendsetVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }
    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable
                data={legendsetDataHideNa}
                visualization={visualization}
            />
        </div>
    )
}

TypeLegendset.storyName = 'Legendset'

export const TypeNumericNA = (_, { pivotTableOptions }) => {
    const visualization = {
        ...integerVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={integerData} visualization={visualization} />
        </div>
    )
}

TypeNumericNA.storyName = 'Numeric N/A'

export const TypeNumeric = (_, { pivotTableOptions }) => {
    const visualization = {
        ...integerVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable
                data={integerDataHideNa}
                visualization={visualization}
            />
        </div>
    )
}

TypeNumeric.storyName = 'Numeric'

export const OptionsetNA = (_, { pivotTableOptions }) => {
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

OptionsetNA.storyName = 'Optionset N/A'

export const Optionset = (_, { pivotTableOptions }) => {
    const visualization = {
        ...optionsetVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable
                data={optionsetDataHideNa}
                visualization={visualization}
            />
        </div>
    )
}

Optionset.storyName = 'Optionset'

export const TextNA = (_, { pivotTableOptions }) => {
    const visualization = {
        ...emailVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={emailData} visualization={visualization} />
        </div>
    )
}

TextNA.storyName = 'Text N/A'

export const Text = (_, { pivotTableOptions }) => {
    const visualization = {
        ...emailVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={emailDataHideNa} visualization={visualization} />
        </div>
    )
}

Text.storyName = 'Text'

export const TimeNA = (_, { pivotTableOptions }) => {
    const visualization = {
        ...timeVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={timeData} visualization={visualization} />
        </div>
    )
}

TimeNA.storyName = 'Time N/A'

export const Time = (_, { pivotTableOptions }) => {
    const visualization = {
        ...timeVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable data={timeDataHideNa} visualization={visualization} />
        </div>
    )
}

Time.storyName = 'Time'

export const YesonlyNA = (_, { pivotTableOptions }) => {
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

YesonlyNA.storyName = 'Yesonly N/A'

export const Yesonly = (_, { pivotTableOptions }) => {
    const visualization = {
        ...yesonlyVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable
                data={yesonlyDataHideNa}
                visualization={visualization}
            />
        </div>
    )
}

Yesonly.storyName = 'Yesonly'

export const EventstatusNA = (_, { pivotTableOptions }) => {
    const visualization = {
        ...eventstatusVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable
                data={eventstatusData}
                visualization={visualization}
            />
        </div>
    )
}

EventstatusNA.storyName = 'Eventstatus N/A'

export const Eventstatus = (_, { pivotTableOptions }) => {
    const visualization = {
        ...eventstatusVisualization,
        ...visualizationReset,
        ...pivotTableOptions,
    }

    return (
        <div style={{ width: 800, height: 600 }}>
            <PivotTable
                data={eventstatusDataHideNa}
                visualization={visualization}
            />
        </div>
    )
}

Eventstatus.storyName = 'Eventstatus'
