import getPieSeries from './pie.js'

export default function (series, colors) {
    const donutSeries = getPieSeries(series, colors)
    console.log("donutSeries", donutSeries)

    donutSeries[0].innerSize = '75%'
    return donutSeries
}