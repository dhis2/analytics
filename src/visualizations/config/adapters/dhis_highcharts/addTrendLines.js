import arrayContains from 'd2-utilizr/lib/arrayContains'
import { rgb } from 'd3-color'

import getStackedData from './getStackedData'
import {
    VIS_TYPE_GAUGE,
    VIS_TYPE_PIE,
    isTwoCategoryChartType,
} from '../../../../modules/visTypes'

const DEFAULT_TRENDLINE = {
    type: 'spline',
    name: 'Trend',
    dashStyle: 'solid',
    color: '#333',
    lineWidth: 1,
    marker: {
        enabled: false,
        symbol: 'circle',
        radius: 2,
    },
}

export const isRegressionIneligible = type =>
    arrayContains([VIS_TYPE_GAUGE, VIS_TYPE_PIE], type)

export default function(layout, series, isStacked) {
    if (isTwoCategoryChartType(layout.type) && layout.rows.length > 1) {
        return getTwoCategoryTrendLines(layout, series, isStacked)
    } else {
        return getDefaultTrendLines(layout, series, isStacked)
    }
}

function getDefaultTrendLines(layout, series, isStacked) {
    const newSeries = []

    if (isStacked) {
        newSeries.push(
            ...series,
            Object.assign(
                {},
                getRegressionObj(
                    getStackedData(series, layout),
                    layout.regressionType
                )
            )
        )
    } else {
        series.forEach(seriesObj => {
            newSeries.push(
                seriesObj,
                Object.assign(
                    {},
                    getRegressionObj(seriesObj.data, layout.regressionType),
                    {
                        name: seriesObj.name + ' (trend)',
                        color: getDarkerColor(seriesObj.color),
                    }
                )
            )
        })
    }

    return newSeries
}

function getTwoCategoryTrendlineConfig(
    groupObj,
    groupIndex,
    groupRegressionObject,
    regressionType,
    trendlineId
) {
    const trendlineConfig = getRegressionObj(groupObj, regressionType)

    groupRegressionObject.splice(
        groupIndex * groupObj.length,
        groupObj.length,
        ...trendlineConfig.data.map(point => point[1])
    )

    trendlineConfig.data = groupRegressionObject

    // link trendlines
    // so only 1 label in the legend is shown and all linked trendlines
    // can be toggled simultaneously
    if (groupIndex === 0) {
        trendlineConfig.id = trendlineId
    } else {
        trendlineConfig.linkedTo = trendlineId
    }

    return trendlineConfig
}

function getTwoCategoryTrendLines(layout, series, isStacked) {
    const newSeries = []

    if (isStacked) {
        newSeries.push(...series)

        const stackedData = getStackedData(series, layout)

        const groupRegressionTemplate = Array.from(
            { length: stackedData.flat().length },
            () => null
        )

        stackedData.forEach((groupObj, groupIndex) => {
            const trendlineConfig = getTwoCategoryTrendlineConfig(
                groupObj,
                groupIndex,
                groupRegressionTemplate.slice(),
                layout.regressionType,
                'trendline-stacked'
            )

            newSeries.push(trendlineConfig)
        })
    } else {
        series.forEach(seriesObj => {
            const trendlineSerieId = `trendline-${seriesObj.id}`

            newSeries.push(seriesObj)

            if (!seriesObj.custom.isTwoCategoryFakeSerie) {
                const groupRegressionTemplate = Array.from(
                    { length: seriesObj.custom.data.flat().length },
                    () => null
                )

                seriesObj.custom.data.forEach((groupObj, groupIndex) => {
                    const trendlineConfig = getTwoCategoryTrendlineConfig(
                        groupObj,
                        groupIndex,
                        groupRegressionTemplate.slice(),
                        layout.regressionType,
                        trendlineSerieId
                    )

                    newSeries.push(
                        Object.assign({}, trendlineConfig, {
                            name: seriesObj.name + ' (trend)',
                            color: getDarkerColor(seriesObj.color),
                        })
                    )
                })
            }
        })
    }

    return newSeries
}

function getDarkerColor(color) {
    return rgb(color)
        .darker(0.5)
        .toString()
}

function getRegressionData(data) {
    return data.map((value, index) => {
        return [index, value]
    })
}

function getRegressionObj(data, regressionType) {
    // LINEAR:
    // - decimalPlaces (default = 2)
    // LOESS:
    // - loessSmooth (default = 25)
    // POLYNOMIAL:
    // - order (default = 2)
    // - extrapolate (default = 0)
    // - decimalPlaces (default = 2)

    let regression
    const regressionTypeOptions = {}

    switch (regressionType) {
        case 'POLYNOMIAL':
            // polynomial(data, order, extrapolate)
            regression = polynomial(getRegressionData(data))
            break
        case 'LOESS':
            // loess(data, smoothing)
            regression = loess(getRegressionData(data), 0.25)
            break
        case 'LINEAR':
        default:
            // linear(data, decimalPlaces)
            regression = linear(getRegressionData(data))
            regressionTypeOptions.type = 'line'
            break
    }

    return Object.assign({}, DEFAULT_TRENDLINE, regressionTypeOptions, {
        data: regression.points,
    })
}

// @author: Ignacio Vazquez
// Based on
// - http://commons.apache.org/proper/commons-math/download_math.cgi LoesInterpolator.java
// - https://gist.github.com/avibryant/1151823
function loess(data, bandwidth = 0.25) {
    const xval = data.map(pair => {
        return pair[0]
    })

    const distinctX = array_unique(xval)

    if (2 / distinctX.length > bandwidth) {
        bandwidth = Math.min(2 / distinctX.length, 1)
    }

    const yval = data.map(pair => {
        return pair[1]
    })

    function array_unique(values) {
        const o = {},
            l = values.length,
            r = []

        for (let i = 0; i < l; i += 1) {
            o[values[i]] = values[i]
        }

        for (const i in o) {
            r.push(o[i])
        }

        return r
    }

    function tricube(x) {
        const tmp = 1 - x * x * x

        return tmp * tmp * tmp
    }

    const res = []

    let left = 0
    let right = Math.floor(bandwidth * xval.length) - 1

    for (const i in xval) {
        const x = xval[i]

        if (i > 0) {
            if (
                right < xval.length - 1 &&
                xval[right + 1] - xval[i] < xval[i] - xval[left]
            ) {
                left++
                right++
            }
        }

        let edge

        if (xval[i] - xval[left] > xval[right] - xval[i]) {
            edge = left
        } else {
            edge = right
        }

        const denom = Math.abs(1.0 / (xval[edge] - x))
        let sumWeights = 0
        let sumX = 0,
            sumXSquared = 0,
            sumY = 0,
            sumXY = 0

        let k = left

        while (k <= right) {
            const xk = xval[k]
            const yk = yval[k]
            let dist

            if (k < i) {
                dist = x - xk
            } else {
                dist = xk - x
            }

            const w = tricube(dist * denom)
            const xkw = xk * w

            sumWeights += w
            sumX += xkw
            sumXSquared += xk * xkw
            sumY += yk * w
            sumXY += yk * xkw
            k++
        }

        const meanX = sumX / sumWeights

        const meanY = sumY / sumWeights
        const meanXY = sumXY / sumWeights
        const meanXSquared = sumXSquared / sumWeights
        let beta

        if (meanXSquared === meanX * meanX) {
            beta = 0
        } else {
            beta = (meanXY - meanX * meanY) / (meanXSquared - meanX * meanX)
        }

        const alpha = meanY - beta * meanX
        res[i] = beta * x + alpha
    }

    return {
        equation: '',
        points: xval.map((x, i) => {
            return [x, res[i]]
        }),
        string: '',
    }
}

/*
 *
 * Code from here to EOF adapted from https://github.com/Tom-Alexander/regression-js/
 *
 */
const DEFAULT_OPTIONS = { order: 2, precision: 2, period: null }

/**
 * Determine the coefficient of determination (r^2) of a fit from the observations
 * and predictions.
 *
 * @param {Array<Array<number>>} data - Pairs of observed x-y values
 * @param {Array<Array<number>>} results - Pairs of observed predicted x-y values
 *
 * @return {number} - The r^2 value, or NaN if one cannot be calculated.
 */
function determinationCoefficient(data, results) {
    const predictions = []
    const observations = []

    data.forEach((d, i) => {
        if (d[1] !== null) {
            observations.push(d)
            predictions.push(results[i])
        }
    })

    const sum = observations.reduce((a, observation) => a + observation[1], 0)
    const mean = sum / observations.length

    const ssyy = observations.reduce((a, observation) => {
        const difference = observation[1] - mean
        return a + difference * difference
    }, 0)

    const sse = observations.reduce((accum, observation, index) => {
        const prediction = predictions[index]
        const residual = observation[1] - prediction[1]
        return accum + residual * residual
    }, 0)

    return 1 - sse / ssyy
}

/**
 * Determine the solution of a system of linear equations A * x = b using
 * Gaussian elimination.
 *
 * @param {Array<Array<number>>} input - A 2-d matrix of data in row-major form [ A | b ]
 * @param {number} order - How many degrees to solve for
 *
 * @return {Array<number>} - Vector of normalized solution coefficients matrix (x)
 */
function gaussianElimination(input, order) {
    const matrix = input
    const n = input.length - 1
    const coefficients = [order]

    for (let i = 0; i < n; i++) {
        let maxrow = i
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(matrix[i][j]) > Math.abs(matrix[i][maxrow])) {
                maxrow = j
            }
        }

        for (let k = i; k < n + 1; k++) {
            const tmp = matrix[k][i]
            matrix[k][i] = matrix[k][maxrow]
            matrix[k][maxrow] = tmp
        }

        for (let j = i + 1; j < n; j++) {
            for (let k = n; k >= i; k--) {
                matrix[k][j] -= (matrix[k][i] * matrix[i][j]) / matrix[i][i]
            }
        }
    }

    for (let j = n - 1; j >= 0; j--) {
        let total = 0
        for (let k = j + 1; k < n; k++) {
            total += matrix[k][j] * coefficients[k]
        }

        coefficients[j] = (matrix[n][j] - total) / matrix[j][j]
    }

    return coefficients
}

/**
 * Round a number to a precision, specificed in number of decimal places
 *
 * @param {number} number - The number to round
 * @param {number} precision - The number of decimal places to round to:
 *                             > 0 means decimals, < 0 means powers of 10
 *
 *
 * @return {numbr} - The number, rounded
 */
function round(number, precision) {
    const factor = 10 ** precision
    return Math.round(number * factor) / factor
}

function linear(data, options = DEFAULT_OPTIONS) {
    const sum = [0, 0, 0, 0, 0]
    let len = 0

    for (let n = 0; n < data.length; n++) {
        if (data[n][1] !== null) {
            len++
            sum[0] += data[n][0]
            sum[1] += data[n][1]
            sum[2] += data[n][0] * data[n][0]
            sum[3] += data[n][0] * data[n][1]
            sum[4] += data[n][1] * data[n][1]
        }
    }

    const run = len * sum[2] - sum[0] * sum[0]
    const rise = len * sum[3] - sum[0] * sum[1]
    const gradient = run === 0 ? 0 : round(rise / run, options.precision)
    const intercept = round(
        sum[1] / len - (gradient * sum[0]) / len,
        options.precision
    )

    const predict = x => [
        round(x, options.precision),
        round(gradient * x + intercept, options.precision),
    ]

    const points = data.map(point => predict(point[0]))

    return {
        points,
        predict,
        equation: [gradient, intercept],
        r2: round(determinationCoefficient(data, points), options.precision),
        string:
            intercept === 0
                ? `y = ${gradient}x`
                : `y = ${gradient}x + ${intercept}`,
    }
}

function polynomial(data, options = DEFAULT_OPTIONS) {
    const lhs = []
    const rhs = []
    let a = 0
    let b = 0
    const len = data.length
    const k = options.order + 1

    for (let i = 0; i < k; i++) {
        for (let l = 0; l < len; l++) {
            if (data[l][1] !== null) {
                a += data[l][0] ** i * data[l][1]
            }
        }

        lhs.push(a)
        a = 0

        const c = []
        for (let j = 0; j < k; j++) {
            for (let l = 0; l < len; l++) {
                if (data[l][1] !== null) {
                    b += data[l][0] ** (i + j)
                }
            }
            c.push(b)
            b = 0
        }
        rhs.push(c)
    }
    rhs.push(lhs)

    const coefficients = gaussianElimination(rhs, k).map(v =>
        round(v, options.precision)
    )

    const predict = x => [
        round(x, options.precision),
        round(
            coefficients.reduce(
                (sum, coeff, power) => sum + coeff * x ** power,
                0
            ),
            options.precision
        ),
    ]

    const points = data.map(point => predict(point[0]))

    let string = 'y = '
    for (let i = coefficients.length - 1; i >= 0; i--) {
        if (i > 1) {
            string += `${coefficients[i]}x^${i} + `
        } else if (i === 1) {
            string += `${coefficients[i]}x + `
        } else {
            string += coefficients[i]
        }
    }

    return {
        string,
        points,
        predict,
        equation: [...coefficients].reverse(),
        r2: round(determinationCoefficient(data, points), options.precision),
    }
}
