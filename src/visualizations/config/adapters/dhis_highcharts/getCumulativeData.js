import numberDecimals from 'd2-utilizr/lib/numberDecimals'
import { isDualCategoryChartType } from '../../../../modules/visTypes'

function getDefaultCumulativeData(series) {
    let decimals = 0
    let cumulativeValues = []

    series.forEach(seriesObj => {
        cumulativeValues = seriesObj.data.reduce(
            (accumulator, value, index) => {
                decimals = Math.max(decimals, numberDecimals(value))

                if (index > 0) {
                    value += accumulator[index - 1]
                }

                accumulator.push(value)

                return accumulator
            },
            []
        )

        // round values to the largest number of decimals found in the serie
        // this is to avoid the floating-point problems in JavaScript
        // the condition in the return statement is because sometimes value can be null
        seriesObj.data = cumulativeValues.map(value => {
            return value ? parseFloat(value.toFixed(decimals)) : value
        })

        decimals = 0
    })

    return series
}

function getDualCategoryCumulativeData(series) {
    let decimals = 0

    series
        .filter(seriesObj => !seriesObj.custom.isDualCategoryFakeSerie)
        .forEach(seriesObj => {
            const cumulativeValues = []

            seriesObj.custom.data.forEach(groupObj => {
                const cumulativeGroupValues = []

                groupObj.forEach((value, index) => {
                    decimals = Math.max(decimals, numberDecimals(value))

                    if (index > 0) {
                        value += cumulativeGroupValues[index - 1]
                    }

                    cumulativeGroupValues.push(value)
                })

                cumulativeValues.push(cumulativeGroupValues)
            })

            // round values to the largest number of decimals found in the serie
            // this is to avoid the floating-point problems in JavaScript
            // the condition in the return statement is because sometimes value can be null
            seriesObj.custom.data = cumulativeValues.map(groupObj =>
                groupObj.map(value =>
                    value ? parseFloat(value.toFixed(decimals)) : value
                )
            )

            seriesObj.data = seriesObj.custom.data.flat()

            decimals = 0
        })

    return series
}

export default function(series, layout) {
    if (isDualCategoryChartType(layout.type) && layout.rows.length > 1) {
        return getDualCategoryCumulativeData(series)
    } else {
        return getDefaultCumulativeData(series)
    }
}
