import i18n from '@dhis2/d2-i18n'
import { std, mean } from 'mathjs'
import { PROP_NORMALIZATION_METHOD, PROP_THRESHOLD_FACTOR } from './index'
import { denormalizerMap } from './normalization'

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
    const denormalizer = denormalizerMap[config[PROP_NORMALIZATION_METHOD]]
    const lowThresholdLine = [
        [xyStats.xMin, denormalizer(xyStats.xMin, lowZScoreThreshold)],
        [xyStats.xMax, denormalizer(xyStats.xMax, lowZScoreThreshold)],
    ]
    const highThresholdLine = [
        [xyStats.xMin, denormalizer(xyStats.xMin, highZScoreThreshold)],
        [xyStats.xMax, denormalizer(xyStats.xMax, highZScoreThreshold)],
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
                name: i18n.t('{{thresholdFactor}} × Z-score low', {
                    thresholdFactor: config[PROP_THRESHOLD_FACTOR],
                }),
                value: lowZScoreThreshold,
                line: lowThresholdLine,
            },
            {
                name: i18n.t('{{thresholdFactor}} × Z-score high', {
                    thresholdFactor: config[PROP_THRESHOLD_FACTOR],
                }),
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
