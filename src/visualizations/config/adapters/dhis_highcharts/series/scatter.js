const DEFAULT_COLOR = '#a8bf24'
const OUTLIER_COLOR = 'red'
const POINT_MARKER_SYMBOL = 'circle'

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
                    symbol: POINT_MARKER_SYMBOL,
                    fillColor: DEFAULT_COLOR,
                    lineColor: 'rgb(0,0,0,0.5)',
                    radius: 4,
                },
                color: DEFAULT_COLOR,
            })

        helper.outlierPoints.length &&
            series.push({
                data: helper.outlierPoints,
                marker: {
                    symbol: POINT_MARKER_SYMBOL,
                    fillColor: OUTLIER_COLOR,
                    lineColor: OUTLIER_COLOR,
                    radius: 4,
                },
                color: OUTLIER_COLOR,
            })

        // thresholds

        helper.thresholds.forEach(obj => {
            series.push({
                data: obj.line,
                name: obj.name,
                title: obj.name,
                type: 'line',
                color: '#789',
                marker: { radius: 0 },
                tooltip: {
                    pointFormat: '{series.name}',
                    headerFormat: '',
                },
            })
        })

        // regression

        helper.vars.normalizationHelper?.regression &&
            series.push({
                data: helper.vars.normalizationHelper.regression.points,
                name: 'Linear Regression',
                title: 'Linear Regression',
                type: 'line',
                color: '#000',
                marker: { radius: 0 },
                tooltip: {
                    pointFormat: '{series.name}',
                    headerFormat: '',
                },
            })
    } else {
        series.push({
            data: extraOptions.scatterPoints,
            marker: {
                symbol: POINT_MARKER_SYMBOL,
                fillColor: DEFAULT_COLOR,
                lineColor: DEFAULT_COLOR,
                radius: 4,
            },
            color: DEFAULT_COLOR,
        })
    }

    return series
}
