import { std, mean } from 'mathjs'

export const Z_SCORE = 'Z_SCORE'

export const getStdDev = data => std(data, 'unbiased')

export const getMean = data => mean(data)

export const getZScoreHelper = (dataWithNormalization, config, { xyStats }) => {
    if (!dataWithNormalization.length) {
        throw 'Z-score analysis requires at least one value'
    }
    const normalizedData = dataWithNormalization.map(obj => obj.normalized)
    const stdDev = getStdDev(normalizedData)
    const zScoreThreshold = stdDev * config.thresholdFactor
    const mean = getMean(normalizedData)
    const lowZScoreThreshold = mean - zScoreThreshold
    const highZScoreThreshold = mean + zScoreThreshold

    const lowThresholdLine = [
        [config.xMin, deNormalizer(xyStats.xMin, lowThreshold)],
        [config.xMax, deNormalizer(xyStats.xMax, lowThreshold)],
    ]
    const highThresholdLine = [
        [config.xMin, deNormalizer(xyStats.xMin, highThreshold)],
        [config.xMax, deNormalizer(xyStats.xMax, highThreshold)],
    ]

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
                value: lowZScoreThreshold,
                line: lowThresholdLine,
            },
            {
                name: `${config.thresholdFactor} x Z-score High`,
                value: highZScoreThreshold,
                line: highThresholdLine,
            },
        ],
        isLowOutlier,
        isHighOutlier,
        isOutlier,
        detectOutliers,
        outlierPoints,
        inlierPoints,
        xPercentile,
        yPercentile,
        vars: {
            stdDev,
            zScoreThreshold,
            mean,
            lowZScoreThreshold,
            highZScoreThreshold,
            dataWithNormalization,
            config,
            xyStats,
        },
    }
}
