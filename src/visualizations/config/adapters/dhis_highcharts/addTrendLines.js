import arrayContains from 'd2-utilizr/lib/arrayContains'
import { rgb } from 'd3-color'

import getStackedData from './getStackedData'
import { VIS_TYPE_GAUGE, VIS_TYPE_PIE } from '../../../../modules/visTypes'

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

export default function(regressionType, series, isStacked) {
    const newSeries = []

    if (isStacked) {
        newSeries.push(
            ...series,
            Object.assign(
                {},
                getRegressionObj(getStackedData(series), regressionType)
            )
        )
    } else {
        series.forEach(seriesObj => {
            newSeries.push(
                seriesObj,
                Object.assign(
                    {},
                    getRegressionObj(seriesObj.data, regressionType),
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

function getColor(colors, index) {
    return colors[index] || getColor(colors, index - colors.length)
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
    let regressionTypeOptions = {}

    switch (regressionType) {
        case 'LINEAR':
            // linear(data, decimalPlaces)
            regression = linear(getRegressionData(data))
            regressionTypeOptions.type = 'line'
            break
        case 'POLYNOMIAL':
            // polynomial(data, order, extrapolate)
            regression = polynomial(getRegressionData(data))
            break
        case 'LOESS':
            // loess(data, smoothing)
            regression = loess(getRegressionData(data), 0.25)
            break
    }

    return Object.assign({}, DEFAULT_TRENDLINE, regressionTypeOptions, {
        data: regression.points,
    })
}

// Code extracted from https://github.com/Tom-Alexander/regression-js/
function gaussianElimination(a, o) {
    let maxrow = 0,
        tmp = 0,
        n = a.length - 1,
        x = new Array(o)

    for (let i = 0; i < n; i++) {
        maxrow = i

        for (let j = i + 1; j < n; j++) {
            if (Math.abs(a[i][j]) > Math.abs(a[i][maxrow])) {
                maxrow = j
            }
        }

        for (let k = i; k < n + 1; k++) {
            tmp = a[k][i]
            a[k][i] = a[k][maxrow]
            a[k][maxrow] = tmp
        }

        for (let j = i + 1; j < n; j++) {
            for (let k = n; k >= i; k--) {
                a[k][j] -= (a[k][i] * a[i][j]) / a[i][i]
            }
        }
    }

    for (let j = n - 1; j >= 0; j--) {
        tmp = 0

        for (let k = j + 1; k < n; k++) {
            tmp += a[k][j] * x[k]
        }

        x[j] = (a[n][j] - tmp) / a[j][j]
    }

    return x
}

// Code extracted from https://github.com/Tom-Alexander/regression-js/
// Human readable formulas:
//
//              N * Σ(XY) - Σ(X)
// intercept = ---------------------
//              N * Σ(X^2) - Σ(X)^2
//
// correlation = N * Σ(XY) - Σ(X) * Σ (Y) / √ (  N * Σ(X^2) - Σ(X) ) * ( N * Σ(Y^2) - Σ(Y)^2 ) ) )
function linear(data, decimalPlaces = 2) {
    let sum = [0, 0, 0, 0, 0],
        results = [],
        N = data.length

    for (let n = 0, len = data.length; n < len; n++) {
        if (data[n]['x'] != null) {
            data[n][0] = data[n].x
            data[n][1] = data[n].y
        }
        if (data[n][1] != null) {
            sum[0] += data[n][0] // Σ(X)
            sum[1] += data[n][1] // Σ(Y)
            sum[2] += data[n][0] * data[n][0] // Σ(X^2)
            sum[3] += data[n][0] * data[n][1] // Σ(XY)
            sum[4] += data[n][1] * data[n][1] // Σ(Y^2)
        } else {
            N -= 1
        }
    }

    let gradient =
        (N * sum[3] - sum[0] * sum[1]) / (N * sum[2] - sum[0] * sum[0])
    let intercept = sum[1] / N - (gradient * sum[0]) / N
    // let correlation = (N * sum[3] - sum[0] * sum[1]) / Math.sqrt((N * sum[2] - sum[0] * sum[0]) * (N * sum[4] - sum[1] * sum[1]));

    for (let i = 0, len = data.length; i < len; i++) {
        let coorY = data[i][0] * gradient + intercept

        if (decimalPlaces) {
            coorY = parseFloat(coorY.toFixed(decimalPlaces))
        }

        let coordinate = [data[i][0], coorY]
        results.push(coordinate)
    }

    results.sort((a, b) => {
        if (a[0] > b[0]) {
            return 1
        }
        if (a[0] < b[0]) {
            return -1
        }

        return 0
    })

    let string =
        'y = ' +
        Math.round(gradient * 100) / 100 +
        'x + ' +
        Math.round(intercept * 100) / 100

    return {
        equation: [gradient, intercept],
        points: results,
        string: string,
    }
}

// Code extracted from https://github.com/Tom-Alexander/regression-js/
function logarithmic(data) {
    let sum = [0, 0, 0, 0],
        results = [],
        mean = 0

    for (let n = 0, len = data.length; n < len; n++) {
        if (data[n].x != null) {
            data[n][0] = data[n].x
            data[n][1] = data[n].y
        }
        if (data[n][1] != null) {
            sum[0] += Math.log(data[n][0])
            sum[1] += data[n][1] * Math.log(data[n][0])
            sum[2] += data[n][1]
            sum[3] += Math.pow(Math.log(data[n][0]), 2)
        }
    }

    let B = (n * sum[1] - sum[2] * sum[0]) / (n * sum[3] - sum[0] * sum[0])
    let A = (sum[2] - B * sum[0]) / n

    for (let i = 0, len = data.length; i < len; i++) {
        let coordinate = [data[i][0], A + B * Math.log(data[i][0])]

        results.push(coordinate)
    }

    results.sort((a, b) => {
        if (a[0] > b[0]) {
            return 1
        }
        if (a[0] < b[0]) {
            return -1
        }

        return 0
    })

    let string =
        'y = ' +
        Math.round(A * 100) / 100 +
        ' + ' +
        Math.round(B * 100) / 100 +
        ' ln(x)'

    return {
        equation: [A, B],
        points: results,
        string: string,
    }
}

// Code extracted from https://github.com/Tom-Alexander/regression-js/
function power(data) {
    let sum = [0, 0, 0, 0],
        results = []

    for (let n = 0, len = data.length; n < len; n++) {
        if (data[n].x != null) {
            data[n][0] = data[n].x
            data[n][1] = data[n].y
        }
        if (data[n][1] != null) {
            sum[0] += Math.log(data[n][0])
            sum[1] += Math.log(data[n][1]) * Math.log(data[n][0])
            sum[2] += Math.log(data[n][1])
            sum[3] += Math.pow(Math.log(data[n][0]), 2)
        }
    }

    let B = (n * sum[1] - sum[2] * sum[0]) / (n * sum[3] - sum[0] * sum[0])
    let A = Math.pow(Math.E, (sum[2] - B * sum[0]) / n)

    for (let i = 0, len = data.length; i < len; i++) {
        let coordinate = [data[i][0], A * Math.pow(data[i][0], B)]

        results.push(coordinate)
    }

    results.sort((a, b) => {
        if (a[0] > b[0]) {
            return 1
        }
        if (a[0] < b[0]) {
            return -1
        }

        return 0
    })

    let string =
        'y = ' + Math.round(A * 100) / 100 + 'x^' + Math.round(B * 100) / 100

    return {
        equation: [A, B],
        points: results,
        string: string,
    }
}

// Code extracted from https://github.com/Tom-Alexander/regression-js/
function polynomial(data, order = 2, extrapolate = 0, decimalPlaces = 2) {
    let lhs = [],
        rhs = [],
        results = [],
        a = 0,
        b = 0,
        k = order + 1

    for (let i = 0; i < k; i++) {
        for (let l = 0, len = data.length; l < len; l++) {
            if (data[l].x != null) {
                data[l][0] = data[l].x
                data[l][1] = data[l].y
            }
            if (data[l][1] != null) {
                a += Math.pow(data[l][0], i) * data[l][1]
            }
        }

        lhs.push(a)

        a = 0

        let c = []

        for (let j = 0; j < k; j++) {
            for (let l = 0, len = data.length; l < len; l++) {
                if (data[l][1]) {
                    b += Math.pow(data[l][0], i + j)
                }
            }

            c.push(b)

            b = 0
        }

        rhs.push(c)
    }

    rhs.push(lhs)

    let equation = gaussianElimination(rhs, k)

    let resultLength = data.length + extrapolate
    let step = data[data.length - 1][0] - data[data.length - 2][0]

    for (let i = 0, len = resultLength; i < len; i++) {
        let answer = 0,
            x = 0

        if (typeof data[i] !== 'undefined') {
            x = data[i][0]
        } else {
            x = data[data.length - 1][0] + (i - data.length) * step
        }

        for (let w = 0; w < equation.length; w++) {
            answer += equation[w] * Math.pow(x, w)

            if (decimalPlaces) {
                answer = parseFloat(answer.toFixed(decimalPlaces))
            }
        }

        results.push([x, answer])
    }

    results.sort((a, b) => {
        if (a[0] > b[0]) {
            return 1
        }
        if (a[0] < b[0]) {
            return -1
        }

        return 0
    })

    let string = 'y = '

    for (let i = equation.length - 1; i >= 0; i--) {
        if (i > 1) {
            string += Math.round(equation[i] * 100) / 100 + 'x^' + i + ' + '
        } else if (i == 1) {
            string += Math.round(equation[i] * 100) / 100 + 'x' + ' + '
        } else {
            string += Math.round(equation[i] * 100) / 100
        }
    }

    return {
        equation: equation,
        points: results,
        string: string,
    }
}

// @author: Ignacio Vazquez
// Based on
// - http://commons.apache.org/proper/commons-math/download_math.cgi LoesInterpolator.java
// - https://gist.github.com/avibryant/1151823
function loess(data, bandwidth = 0.25) {
    let xval = data.map(pair => {
        return pair[0]
    })

    let distinctX = array_unique(xval)

    if (2 / distinctX.length > bandwidth) {
        bandwidth = Math.min(2 / distinctX.length, 1)
    }

    let yval = data.map(pair => {
        return pair[1]
    })

    function array_unique(values) {
        let o = {},
            i,
            l = values.length,
            r = []

        for (i = 0; i < l; i += 1) {
            o[values[i]] = values[i]
        }

        for (i in o) {
            r.push(o[i])
        }

        return r
    }

    function tricube(x) {
        let tmp = 1 - x * x * x

        return tmp * tmp * tmp
    }

    let res = []

    let left = 0
    let right = Math.floor(bandwidth * xval.length) - 1

    for (let i in xval) {
        let x = xval[i]

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

        let denom = Math.abs(1.0 / (xval[edge] - x))
        let sumWeights = 0
        let sumX = 0,
            sumXSquared = 0,
            sumY = 0,
            sumXY = 0

        let k = left

        while (k <= right) {
            let xk = xval[k]
            let yk = yval[k]
            let dist

            if (k < i) {
                dist = x - xk
            } else {
                dist = xk - x
            }

            let w = tricube(dist * denom)
            let xkw = xk * w

            sumWeights += w
            sumX += xkw
            sumXSquared += xk * xkw
            sumY += yk * w
            sumXY += yk * xkw
            k++
        }

        let meanX = sumX / sumWeights

        let meanY = sumY / sumWeights
        let meanXY = sumXY / sumWeights
        let meanXSquared = sumXSquared / sumWeights
        let beta

        if (meanXSquared == meanX * meanX) {
            beta = 0
        } else {
            beta = (meanXY - meanX * meanY) / (meanXSquared - meanX * meanX)
        }

        let alpha = meanY - beta * meanX
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
