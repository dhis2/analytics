import i18n from '@dhis2/d2-i18n'

import { PROP_NORMALIZATION_METHOD, PROP_THRESHOLD_FACTOR } from './index'
import { denormalizerMap } from './normalization'

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
    const median =
        typeof cache.median === 'number'
            ? cache.median
            : getMedian(normalizedData)
    const medianAD =
        typeof cache.medianAD === 'number'
            ? cache.medianAD
            : getMedianAbsoluteDeviation()
    let dataWithZScore

    if (medianAD === 0) {
        const meanAD =
            typeof cache.meanAD === 'number'
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
    dataWithNormalization,
    config,
    { xyStats }
) => {
    const normalizedData = dataWithNormalization.map(obj => obj.normalized)
    const median = getMedian(normalizedData)
    const medianAD = getMedianAbsoluteDeviation(normalizedData, median)
    const meanAD =
        medianAD === 0 ? getMeanAbsoluteDeviation(normalizedData) : null

    const dataWithZScore = getDataWithZScore(dataWithNormalization, {
        normalizedData,
        median,
        medianAD,
    })

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

    const denormalizer = denormalizerMap[config[PROP_NORMALIZATION_METHOD]]

    const lowThresholdLine = [
        [xyStats.xMin, denormalizer(xyStats.xMin, lowThreshold)],
        [xyStats.xMax, denormalizer(xyStats.xMax, lowThreshold)],
    ]
    const highThresholdLine = [
        [xyStats.xMin, denormalizer(xyStats.xMin, highThreshold)],
        [xyStats.xMax, denormalizer(xyStats.xMax, highThreshold)],
    ]

    const isLowOutlier = value => value < lowThreshold
    const isHighOutlier = value => value > highThreshold
    const isOutlier = value => isLowOutlier(value) || isHighOutlier(value)
    const outlierPoints = []
    const inlierPoints = []
    const detectOutliers = () =>
        dataWithZScore.forEach(obj => {
            isOutlier(obj.normalized)
                ? outlierPoints.push(obj.point)
                : inlierPoints.push(obj.point)
        })

    return {
        name: MODIFIED_Z_SCORE,
        thresholds: [
            {
                name: i18n.t('{{thresholdFactor}} x Modified Z-score Low', {
                    thresholdFactor: config[PROP_THRESHOLD_FACTOR],
                }),
                value: lowThreshold,
                line: lowThresholdLine,
            },
            {
                name: i18n.t('{{thresholdFactor}} x Modified Z-score High', {
                    thresholdFactor: config[PROP_THRESHOLD_FACTOR],
                }),
                value: highThreshold,
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
            median,
            medianAD,
            meanAD,
            lowThreshold,
            highThreshold,
            dataWithNormalization,
            dataWithZScore,
            normalizedData,
            config,
            xyStats,
        },
    }
}
