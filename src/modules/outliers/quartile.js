import { XY_RATIO } from '.'

export const getQuartilePosition = (data, q) => {
    const pos = (data.length + 1) / 4

    switch (q) {
        case 0.75:
            return pos * 3
        case 0.5:
            return pos * 2
        case 0.25:
        default:
            return pos
    }
}

export const getQuartileValue = (data, q = 0.25) => {
    if (data.length < 3) {
        return
    }

    const pos = getQuartilePosition(data, q)
    const rest = pos % 1

    if (rest === 0) {
        return data[pos - 1]
    }

    var base = Math.floor(pos)
    var diff = data[base] - data[base - 1]

    return data[base - 1] + diff * rest
}

export const getQuartileMethodHelper = (
    dataWithNormalization,
    config = {
        thresholdFactor: 1.5,
        normalization: XY_RATIO,
    }
) => {
    if (!dataWithNormalization.length) {
        throw 'Quartile analysis requires at least one value'
    }
    const normalizedData = dataWithNormalization.map(obj => obj.normalized)
    const q1 = getQuartileValue(normalizedData, 0.25)
    const q3 = getQuartileValue(normalizedData, 0.75)
    const iqr = q3 - q1
    const iqrThreshold = iqr * config.thresholdFactor
    const q1Threshold = q1 - iqrThreshold
    const q3Threshold = q3 + iqrThreshold
    const deNormalizer = deNormalizerMap[config.normalization]
    const q1ThresholdLine = [
        [config.xMin, deNormalizer(config.xMin, q1Threshold)],
        [config.xMax, deNormalizer(config.xMax, q1Threshold)],
    ]
    const q3ThresholdLine = [
        [config.xMin, deNormalizer(config.xMin, q3Threshold)],
        [config.xMax, deNormalizer(config.xMax, q3Threshold)],
    ]
    const isLowOutlier = value => value < q1Threshold
    const isHighOutlier = value => value > q3Threshold
    const isOutlier = value => isLowOutlier(value) || isHighOutlier(value)
    const outlierPoints = []
    const inlierPoints = []
    const detectOutliers = () =>
        dataWithNormalization.forEach(obj => {
            isOutlier(obj.normalized)
                ? outlierPoints.push(obj.point)
                : inlierPoints.push(obj.point)
        })

    return {
        q1,
        q3,
        iqr,
        iqrThreshold,
        q1Threshold,
        q3Threshold,
        q1ThresholdLine,
        q3ThresholdLine,
        isLowOutlier,
        isHighOutlier,
        isOutlier,
        outlierPoints,
        inlierPoints,
        detectOutliers,
        dataWithNormalization,
        thresholdFactor: config.thresholdFactor,
    }
}
