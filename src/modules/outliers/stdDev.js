import { std, mean } from 'mathjs'

export const getStdDev = data => std(data, 'unbiased')

export const getMean = data => mean(data)

export const getStdDevMethodHelper = (
    dataWithNormalization,
    config = {
        thresholdFactor: 1.5,
    }
) => {
    if (!dataWithNormalization.length) {
        throw 'Std dev analysis requires at least one number'
    }
    const normalizedData = dataWithNormalization.map(obj => obj.normalized)
    const stdDev = getStdDev(sortedData)
    const stdDevThreshold = stdDev * config.thresholdFactor
    const mean = getMean(sortedData)
    const lowThreshold = mean - stdDevThreshold
    const highThreshold = mean + stdDevThreshold
    const isLowOutlier = value => value < lowThreshold
    const isHighOutlier = value => value > highThreshold
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
        stdDev,
        stdDevThreshold,
        mean,
        lowThreshold,
        highThreshold,
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
