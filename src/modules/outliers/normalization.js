import { linear } from '../../visualizations/config/adapters/dhis_highcharts/addTrendLines'

export const XY_RATIO = 'XY_RATIO'
export const Y_RESIDUALS_LINEAR = 'Y_RESIDUALS_LINEAR'

// XY ratio

// const getXyRatio = sortedData =>
//     sortedData
//         .map(point => ({
//             point,
//             normalized: point[0] / point[1],
//         }))
//         .sort((a, b) => a.normalized - b.normalized)

// const getXyRatioY = (x, ratio) => x / ratio

// Y residuals

const getYResidualsHelper = sortedData => {
    const regression = linear(sortedData)
    const sortedRegPoints = regression.points
    const regStartPoint = sortedRegPoints[0]
    const regEndPoint = sortedRegPoints[sortedRegPoints.length - 1]

    const helper = {
        regression,
        data: sortedData,
        normalized: sortedData.map(
            (point, i) => point[1] - sortedRegPoints[i][1]
        ),
        getThresholdLines: (lowThreshold, highThreshold) => [
            [
                [regStartPoint[0], regStartPoint[1] - Math.abs(lowThreshold)],
                [regEndPoint[0], regEndPoint[1] - Math.abs(lowThreshold)],
            ],
            [
                [regStartPoint[0], regStartPoint[1] + highThreshold],
                [regEndPoint[0], regEndPoint[1] + highThreshold],
            ],
        ],
    }

    helper.isOutlier = (idx, lowThreshold, highThreshold) =>
        helper.normalized[idx] < lowThreshold ||
        helper.normalized[idx] > highThreshold

    return helper
}

export const denormalizerMap = {
    // [XY_RATIO]: getXyRatioY,
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
