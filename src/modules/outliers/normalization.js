import { linear } from '../../visualizations/config/adapters/dhis_highcharts/addTrendLines'

export const Y_RESIDUALS_LINEAR = 'Y_RESIDUALS_LINEAR'

// Y residuals

const getYResidualsHelper = (sortedData) => {
    const regression = linear(sortedData)
    const sortedRegPoints = regression.points

    const helper = {
        regression,
        data: sortedData,
        normalized: sortedData.map(
            (point, i) => point[1] - sortedRegPoints[i][1]
        ),
        getThresholdLines: (lowThreshold, highThreshold) => {
            const low = []
            const high = []

            sortedRegPoints.forEach((regPoint) => {
                low.push([regPoint[0], regPoint[1] - Math.abs(lowThreshold)])
                high.push([regPoint[0], regPoint[1] + highThreshold])
            })

            return [low, high]
        },
    }

    helper.isOutlierByIndex = (idx, lowThreshold, highThreshold) =>
        helper.normalized[idx] < lowThreshold ||
        helper.normalized[idx] > highThreshold

    return helper
}

export const getNormalizationHelper = (data, normalizationMethod) => {
    const sortedData = data.slice().sort((a, b) => a[0] - b[0])

    switch (normalizationMethod) {
        case Y_RESIDUALS_LINEAR:
        default: {
            return getYResidualsHelper(sortedData)
        }
    }
}
