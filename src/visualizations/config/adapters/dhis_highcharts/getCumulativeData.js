import numberDecimals from 'd2-utilizr/lib/numberDecimals'
import { isTwoCategoryChartType } from '../../../../modules/visTypes.js'
import getTwoCategorySplitSerieData from './getTwoCategorySplitSerieData.js'

export function getDefaultCumulativeData(series) {
    let decimals = 0
    let accData = []

    series.forEach((seriesObj) => {
        let accValue = null

        accData = seriesObj.data.reduce(
            (accSeriesData, value) => {
                if (value === null) {
                    accSeriesData.push(value)
                } else {
                    decimals = Math.max(decimals, numberDecimals(value))
                    accValue += value
                    accSeriesData.push(accValue)
                }

                return accSeriesData
            },
            []
        )

        // round values to the largest number of decimals found in the serie
        // this is to avoid the floating-point problems in JavaScript
        // the condition in the return statement is because sometimes value can be null
        seriesObj.data = accData.map((value) =>
            value ? parseFloat(value.toFixed(decimals)) : value
        )

        decimals = 0
    })

    return series
}

export function getTwoCategoryCumulativeData(series) {
    let accSeriesData
    let decimals

    series
        .filter((seriesObj) => !seriesObj.custom.isTwoCategoryFakeSerie)
        .forEach((seriesObj) => {
            accSeriesData = []
            decimals = 0

            seriesObj.custom.data.forEach((seriesDataByCategory) => {
                const accSeriesDataByCategory = []
                let accValue = null

                seriesDataByCategory.forEach(value => {
                    if (value === null) {
                        accSeriesDataByCategory.push(value)
                    } else {
                        decimals = Math.max(decimals, numberDecimals(value))
                        accValue += value
                        accSeriesDataByCategory.push(accValue)
                    }
                })

                accSeriesData.push(accSeriesDataByCategory)
            })

            // round values to the largest number of decimals found in the serie
            // this is to avoid the floating-point problems in JavaScript
            // the condition in the return statement is because sometimes value can be null
            seriesObj.custom.data = accSeriesData.map((seriesDataByCategory) =>
                seriesDataByCategory.map((value) =>
                    value ? parseFloat(value.toFixed(decimals)) : value
                )
            )

            seriesObj.data = getTwoCategorySplitSerieData(seriesObj.custom.data)
        })

    return series
}

export default function (series, layout) {
    if (isTwoCategoryChartType(layout.type) && layout.rows.length > 1) {
        return getTwoCategoryCumulativeData(series)
    } else {
        return getDefaultCumulativeData(series)
    }
}
