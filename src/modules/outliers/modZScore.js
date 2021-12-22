import isNumber from 'd2-utilizr/lib/isNumber'
import i18n from '../../locales/index.js'
import { PROP_THRESHOLD_FACTOR } from './index.js'

export const MODIFIED_Z_SCORE = 'MODIFIED_Z_SCORE'

const MEDIAN_AD_CORRECTION = 0.6745
const MEAN_AD_CORRECTION = 1.253314

export const getMean = values =>
    values.reduce((total, value) => total + value, 0) / values.length

export const getMedian = values => {
    const hl = values.length / 2
    return hl % 1
        ? values[Math.floor(hl)]
        : getMean([values[hl - 1], values[hl]])
}

// Absolute deviation

export const getMedianAbsoluteDeviation = (
    values,
    median = getMedian(values)
) =>
    getMedian(
        values.map(value => Math.abs(value - median)).sort((a, b) => a - b)
    )

export const getMeanAbsoluteDeviation = (values, mean = getMean(values)) =>
    getMean(values.map(value => Math.abs(value - mean)))

// Modified z-scores

export const getModZScore = (value, median, medianAD) =>
    (MEDIAN_AD_CORRECTION * (value - median)) / medianAD

export const getModZScoreMAD0 = (value, median, meanAD) =>
    (value - median) / (meanAD * MEAN_AD_CORRECTION)

// Thresholds

export const getModZScoreThresholds = (thresholdFactor, medianAD, median) => [
    median - (medianAD * thresholdFactor) / MEDIAN_AD_CORRECTION,
    median + (medianAD * thresholdFactor) / MEDIAN_AD_CORRECTION,
]

export const getModZScoreMAD0Thresholds = (thresholdFactor, meanAD, median) => [
    median - thresholdFactor * meanAD * MEAN_AD_CORRECTION,
    median + thresholdFactor * meanAD * MEAN_AD_CORRECTION,
]

export const getDataWithZScore = (dataWithNormalization, cache = {}) => {
    const normalizedData =
        cache.normalizedData || dataWithNormalization.map(obj => obj.normalized)
    const median = isNumber(cache.median)
        ? cache.median
        : getMedian(normalizedData)
    const medianAD = isNumber(cache.medianAD)
        ? cache.medianAD
        : getMedianAbsoluteDeviation()
    let dataWithZScore

    if (medianAD === 0) {
        const meanAD = isNumber(cache.meanAD)
            ? cache.meanAD
            : getMeanAbsoluteDeviation(normalizedData)
        dataWithZScore = dataWithNormalization.map(obj => ({
            ...obj,
            zScore: getModZScoreMAD0(obj.normalized, median, meanAD),
        }))
    } else {
        dataWithZScore = dataWithNormalization.map(obj => ({
            ...obj,
            zScore: getModZScore(obj.normalized, median, medianAD),
        }))
    }

    return dataWithZScore
}

export const getModZScoreHelper = (
    normalizationHelper,
    config,
    { xyStats }
) => {
    const sortedNormalized = normalizationHelper.normalized
        .slice()
        .sort((a, b) => a - b)
    const median = getMedian(sortedNormalized)
    const medianAD = getMedianAbsoluteDeviation(sortedNormalized, median)
    const meanAD =
        medianAD === 0 ? getMeanAbsoluteDeviation(sortedNormalized) : null

    const [lowThreshold, highThreshold] =
        medianAD === 0
            ? getModZScoreMAD0Thresholds(
                  config[PROP_THRESHOLD_FACTOR],
                  meanAD,
                  median
              )
            : getModZScoreThresholds(
                  config[PROP_THRESHOLD_FACTOR],
                  medianAD,
                  median
              )

    const [lowThresholdLine, highThresholdLine] =
        normalizationHelper.getThresholdLines(lowThreshold, highThreshold)

    const outlierPoints = []
    const inlierPoints = []

    const detectOutliers = () =>
        normalizationHelper.data.forEach((point, idx) => {
            normalizationHelper.isOutlierByIndex(
                idx,
                lowThreshold,
                highThreshold
            )
                ? outlierPoints.push(point)
                : inlierPoints.push(point)
        })

    return {
        name: MODIFIED_Z_SCORE,
        thresholds: [
            {
                name: i18n.t('{{thresholdFactor}} × Modified Z-score low', {
                    thresholdFactor: config[PROP_THRESHOLD_FACTOR],
                }),
                value: lowThreshold,
                line: lowThresholdLine,
            },
            {
                name: i18n.t('{{thresholdFactor}} × Modified Z-score high', {
                    thresholdFactor: config[PROP_THRESHOLD_FACTOR],
                }),
                value: highThreshold,
                line: highThresholdLine,
            },
        ],
        detectOutliers,
        outlierPoints,
        inlierPoints,
        vars: {
            median,
            medianAD,
            meanAD,
            lowThreshold,
            highThreshold,
            normalizationHelper,
            sortedNormalized,
            config,
            xyStats,
        },
    }
}
