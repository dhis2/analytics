const DEFAULT_COLOR = '#a8bf24'

export default extraOptions => {
    const series = []

    if (extraOptions.outlierHelper) {
        const helper = extraOptions.outlierHelper
        helper.detectOutliers()

        // points

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

        // thresholds

        helper.thresholds.forEach(obj => {
            series.push({
                data: obj.line,
                name: obj.name,
                title: obj.name,
                type: 'line',
                color: '#444',
                marker: { radius: 0 },
                tooltip: {
                    pointFormat: '{series.name}',
                    headerFormat: '',
                },
            })
        })
    } else {
        series.push([
            {
                data: extraOptions.scatterPoints,
                marker: {
                    symbol: 'circle',
                    fillColor: DEFAULT_COLOR,
                    lineColor: DEFAULT_COLOR,
                    radius: 4,
                },
                color: DEFAULT_COLOR,
            },
        ])
    }

    return series
}
