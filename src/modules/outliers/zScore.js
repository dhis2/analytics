import { std, mean } from 'mathjs'

export const ZSCORE = 'ZSCORE'

export const getStdDev = data => std(data, 'unbiased')

export const getMean = data => mean(data)

export const getZScoreHelper = (
    dataWithNormalization,
    config = {
        thresholdFactor: 1.5,
    }
) => {
    if (!dataWithNormalization.length) {
        throw 'Std dev analysis requires at least one value'
    }
    const normalizedData = dataWithNormalization.map(obj => obj.normalized)
    const stdDev = getStdDev(normalizedData)
    const zScoreThreshold = stdDev * config.thresholdFactor
    const mean = getMean(normalizedData)
    const lowZScoreThreshold = mean - zScoreThreshold
    const highZScoreThreshold = mean + zScoreThreshold
    // const lowZScoreThresholdLine
    // const highZScoreThresholdLine
    const isLowOutlier = value => value < lowZScoreThreshold
    const isHighOutlier = value => value > highZScoreThreshold
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
        thresholds: [
            {
                name: `${config.thresholdFactor} x Z-score Low`,
                threshold: lowZScoreThreshold,
                line: lowZScoreThresholdLine,
            },
            {
                name: `${config.thresholdFactor} x Z-score High`,
                threshold: highZScoreThreshold,
                line: highZScoreThresholdLine,
            },
        ],
        isLowOutlier,
        isHighOutlier,
        isOutlier,
        detectOutliers,
        outlierPoints,
        inlierPoints,
        vars: {
            stdDev,
            zScoreThreshold,
            mean,
            lowZScoreThreshold,
            highZScoreThreshold,
            dataWithNormalization,
            ...config,
        },
    }
}
