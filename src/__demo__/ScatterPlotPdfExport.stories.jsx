import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    extraOptions,
    responses,
    visualization,
} from '../__fixtures__/scatterPlotData.js'
import { createVisualization } from '../index.js'

export default {
    title: 'ScatterPlot',
}

export const Default = () => {
    const ref = useRef(null)
    const [chart, setChart] = useState(null)
    const exportToPdf = useCallback(() => {
        chart.update({
            exporting: {
                chartOptions: { isPdfExport: true },
            },
        })

        chart.exportChartLocal({
            filename: 'PDF export',
            type: 'application/pdf',
        })
    }, [chart])

    useEffect(() => {
        const obj = createVisualization(
            responses,
            visualization,
            ref.current,
            extraOptions,
            undefined,
            undefined,
            'highcharts'
        )
        setChart(obj.visualization)
    }, [])

    return (
        <>
            {chart && <button onClick={exportToPdf}>Export PDF</button>}
            <div
                style={{
                    width: 800,
                    height: 800,
                    border: '2px solid magenta',
                }}
                ref={ref}
            ></div>
        </>
    )
}
