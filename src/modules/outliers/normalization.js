import { linear } from '../../visualizations/config/adapters/dhis_highcharts/addTrendLines'

export const XY_RATIO = 'XY_RATIO'
export const Y_RESIDUALS_LINEAR = 'Y_RESIDUALS_LINEAR'

// XY ratio

const getXyRatio = sortedData =>
    sortedData
        .map(point => ({
            point,
            normalized: point[0] / point[1],
        }))
        .sort((a, b) => a.normalized - b.normalized)

const getXyRatioY = (x, ratio) => x / ratio

// Y residuals

const getYResiduals = sortedData => {
    const sortedRegPoints = linear(sortedData).points
    const regStartPoint = sortedRegPoints[0]
    const regEndPoint = sortedRegPoints[sortedRegPoints.length - 1]

    return {
        data: sortedData,
        normalized: sortedData
            .map((point, i) => point[1] - sortedRegPoints[i][1])
            .sort((a, b) => a - b),
        getThresholdLines: (q1Threshold, q3Threshold) => [
            [
                [regStartPoint[0], regStartPoint[1] - q1Threshold],
                [regEndPoint[0], regEndPoint[1] - q1Threshold],
            ],
            [
                [regStartPoint[0], regStartPoint[1] + q3Threshold],
                [regEndPoint[0], regEndPoint[1] + q3Threshold],
            ],
        ],
    }
}

export const denormalizerMap = {
    [XY_RATIO]: getXyRatioY,
}

export const getDataWithNormalization = (data, normalizationMethod) => {
    const sortedData = data.slice().sort((a, b) => a[0] - b[0])

    switch (normalizationMethod) {
        case XY_RATIO: {
            return getXyRatio(sortedData)
        }
        case Y_RESIDUALS_LINEAR:
        default: {
            return getYResiduals(sortedData)
        }
    }
}
