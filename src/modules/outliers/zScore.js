import { std, mean } from 'mathjs'
import i18n from '../../locales/index.js'
import { PROP_THRESHOLD_FACTOR } from './index.js'

export const STANDARD_Z_SCORE = 'STANDARD_Z_SCORE'

export const getStdDev = (data) => std(data, 'unbiased')

export const getMean = (data) => mean(data)

export const getZScoreHelper = (normalizationHelper, config, { xyStats }) => {
    const sortedNormalized = normalizationHelper.normalized
        .slice()
        .sort((a, b) => a - b)
    const stdDev = getStdDev(sortedNormalized)
    const zScoreThreshold = stdDev * config[PROP_THRESHOLD_FACTOR]
    const mean = getMean(sortedNormalized)
    const lowZScoreThreshold = mean - zScoreThreshold
    const highZScoreThreshold = mean + zScoreThreshold

    const [lowThresholdLine, highThresholdLine] =
        normalizationHelper.getThresholdLines(
            lowZScoreThreshold,
            highZScoreThreshold
        )

    const outlierPoints = []
    const inlierPoints = []

    const detectOutliers = () =>
        normalizationHelper.data.forEach((point, idx) => {
            normalizationHelper.isOutlierByIndex(
                idx,
                lowZScoreThreshold,
                highZScoreThreshold
            )
                ? outlierPoints.push(point)
                : inlierPoints.push(point)
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
        detectOutliers,
        outlierPoints,
        inlierPoints,
        vars: {
            stdDev,
            zScoreThreshold,
            mean,
            lowZScoreThreshold,
            highZScoreThreshold,
            normalizationHelper,
            sortedNormalized,
            config,
            xyStats,
        },
    }
}
