import { std, mean } from 'mathjs'
import { PROP_NORMALIZATION_METHOD, PROP_THRESHOLD_FACTOR } from './index'
import { deNormalizerMap } from './normalization'

export const STANDARD_Z_SCORE = 'STANDARD_Z_SCORE'

export const getStdDev = data => std(data, 'unbiased')

export const getMean = data => mean(data)

export const getZScoreHelper = (dataWithNormalization, config, { xyStats }) => {
    const normalizedData = dataWithNormalization.map(obj => obj.normalized)
    const stdDev = getStdDev(normalizedData)
    const zScoreThreshold = stdDev * config[PROP_THRESHOLD_FACTOR]
    const mean = getMean(normalizedData)
    const lowZScoreThreshold = mean - zScoreThreshold
    const highZScoreThreshold = mean + zScoreThreshold
    const deNormalizer = deNormalizerMap[config[PROP_NORMALIZATION_METHOD]]
    const lowThresholdLine = [
        [xyStats.xMin, deNormalizer(xyStats.xMin, lowZScoreThreshold)],
        [xyStats.xMax, deNormalizer(xyStats.xMax, lowZScoreThreshold)],
    ]
    const highThresholdLine = [
        [xyStats.xMin, deNormalizer(xyStats.xMin, highZScoreThreshold)],
        [xyStats.xMax, deNormalizer(xyStats.xMax, highZScoreThreshold)],
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
        name: STANDARD_Z_SCORE,
        thresholds: [
            {
                name: `${config[PROP_THRESHOLD_FACTOR]} x Z-score Low`,
                value: lowZScoreThreshold,
                line: lowThresholdLine,
            },
            {
                name: `${config[PROP_THRESHOLD_FACTOR]} x Z-score High`,
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
        vars: {
            stdDev,
            zScoreThreshold,
            mean,
            lowZScoreThreshold,
            highZScoreThreshold,
            dataWithNormalization,
            normalizedData,
            config,
            xyStats,
        },
    }
}
