import { getOutlierHelper } from '../../../../../modules/outliers'

// const DEFAULT_COLOR = '#a8bf24'

export default data => {
    const points = data.map(item => [item.x, item.y])
    const helper = getOutlierHelper(points)
    const series = []

    helper.detectOutliers()

    helper.inlierPoints.length &&
        series.push({
            data: helper.inlierPoints,
            marker: {
                symbol: 'circle',
                fillColor: 'rgb(168, 191, 36)',
                lineColor: 'rgb(168, 191, 36)',
                radius: 4,
            },
            color: 'rgb(168, 191, 36)',
        })

    helper.outlierPoints.length &&
        series.push({
            data: helper.outlierPoints,
            marker: {
                symbol: 'circle',
                fillColor: 'red',
                lineColor: 'red',
                radius: 4,
            },
            color: 'red',
        })

    console.log('HELPER', helper)

    series.push({
        data: helper.q1ThresholdLine,
        type: 'line',
        color: '#333',
        marker: { radius: 0 },
        name: 'Q1',
    })

    series.push({
        data: helper.q3ThresholdLine,
        type: 'line',
        color: '#333',
        marker: { radius: 0 },
        name: 'Q3',
    })

    return series

    // return [
    //     {
    //         data: data.map(item => [item.x, item.y]),
    //         marker: {
    //             symbol: 'circle',
    //             fillColor: DEFAULT_COLOR,
    //             lineColor: DEFAULT_COLOR,
    //             radius: 4,
    //         },
    //         color: DEFAULT_COLOR,
    //     },
    // ]
}
