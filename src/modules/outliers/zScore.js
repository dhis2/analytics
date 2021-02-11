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
    const stdDevThreshold = stdDev * config.thresholdFactor
    const mean = getMean(normalizedData)
    const lowThreshold = mean - stdDevThreshold
    const highThreshold = mean + stdDevThreshold
    // const lowThresholdLine
    // const highThresholdLine
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
        thresholds: [
            {
                name: `${config.thresholdFactor} x Z-score Low`,
                threshold: lowThreshold,
                line: lowThresholdLine,
            },
            {
                name: `${config.thresholdFactor} x Z-score High`,
                threshold: highThreshold,
                line: highThresholdLine,
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
            stdDevThreshold,
            mean,
            lowThreshold,
            highThreshold,
            dataWithNormalization,
            ...config,
        },
    }
}
