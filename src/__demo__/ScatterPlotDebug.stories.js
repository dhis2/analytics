import React, { useEffect, useRef } from 'react'
import {
    extraOptions,
    responses,
    visualization,
} from '../__fixtures__/scatterplotData.js'
import { createVisualization } from '../index.js'

export default {
    title: 'ScatterPlot',
}

export const Default = () => {
    const ref = useRef(null)

    useEffect(() => {
        createVisualization(
            responses,
            visualization,
            ref.current,
            extraOptions,
            undefined,
            undefined,
            'highcharts'
        )
    }, [])

    return (
        <div
            style={{
                width: 800,
                height: 800,
                border: '2px solid magenta',
            }}
            ref={ref}
        ></div>
    )
}
