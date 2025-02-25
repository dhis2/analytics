import numberDecimals from 'd2-utilizr/lib/numberDecimals'
import { isTwoCategoryChartType } from '../../../../modules/visTypes.js'
import getTwoCategorySplitSerieData from './getTwoCategorySplitSerieData.js'

function getDefaultCumulativeData(series) {
    let decimals
    let accValue
    let accData

    series.forEach((seriesObj) => {
        decimals = 0
        accValue = null

        accData = seriesObj.data.reduce((accSeriesData, value) => {
            if (value === null) {
                accSeriesData.push(value)
            } else {
                decimals = Math.max(decimals, numberDecimals(value))
                accValue += value
                accSeriesData.push(accValue)
            }

            return accSeriesData
        }, [])

        // round values to the largest number of decimals found in the serie
        // this is to avoid the floating-point problems in JavaScript
        // the condition in the return statement is because sometimes value can be null
        seriesObj.data = accData.map((value) =>
            value ? parseFloat(value.toFixed(decimals)) : value
        )
    })

    return series
}

function getTwoCategoryCumulativeData(series) {
    let decimals
    let accValue
    let accSeriesData
    let accSeriesDataByCategory

    series
        .filter((seriesObj) => !seriesObj.custom.isTwoCategoryFakeSerie)
        .forEach((seriesObj) => {
            decimals = 0
            accSeriesData = []

            seriesObj.custom.data.forEach((seriesDataByCategory) => {
                accValue = null
                accSeriesDataByCategory = []

                seriesDataByCategory.forEach((value) => {
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
