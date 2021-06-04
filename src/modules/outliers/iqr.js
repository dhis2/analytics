import i18n from '../../locales/index.js'

import { PROP_THRESHOLD_FACTOR } from './index'

export const IQR = 'IQR'
export const Q1 = 0.25
export const Q2 = 0.5
export const Q3 = 0.75

export const getQuartilePosition = (data, quartile) => {
    const pos = (data.length + 1) / 4

    switch (quartile) {
        case Q3:
            return pos * 3
        case Q2:
            return pos * 2
        case Q1:
        default:
            return pos
    }
}

export const getQuartileValue = (data, quartile = Q1) => {
    if (data.length < 3) {
        return
    }

    const pos = getQuartilePosition(data, quartile)
    const rest = pos % 1

    if (rest === 0) {
        return data[pos - 1]
    }

    var base = Math.floor(pos)
    var diff = data[base] - data[base - 1]

    return data[base - 1] + diff * rest
}

export const getIQRHelper = (normalizationHelper, config, { xyStats }) => {
    const sortedNormalized = normalizationHelper.normalized
        .slice()
        .sort((a, b) => a - b)
    const q1 = getQuartileValue(sortedNormalized, Q1)
    const q3 = getQuartileValue(sortedNormalized, Q3)
    const iqr = q3 - q1
    const iqrThreshold = iqr * config[PROP_THRESHOLD_FACTOR]
    const q1Threshold = q1 - iqrThreshold
    const q3Threshold = q3 + iqrThreshold

    const [
        q1ThresholdLine,
        q3ThresholdLine,
    ] = normalizationHelper.getThresholdLines(q1Threshold, q3Threshold)

    const outlierPoints = []
    const inlierPoints = []

    const detectOutliers = () =>
        normalizationHelper.data.forEach((point, idx) => {
            normalizationHelper.isOutlierByIndex(idx, q1Threshold, q3Threshold)
                ? outlierPoints.push(point)
                : inlierPoints.push(point)
        })

    return {
        name: IQR,
        thresholds: [
            {
                name: i18n.t('{{thresholdFactor}} × IQR Q1', {
                    thresholdFactor: config[PROP_THRESHOLD_FACTOR],
                }),
                value: q1Threshold,
                line: q1ThresholdLine,
            },
            {
                name: i18n.t('{{thresholdFactor}} × IQR Q3', {
                    thresholdFactor: config[PROP_THRESHOLD_FACTOR],
                }),
                value: q3Threshold,
                line: q3ThresholdLine,
            },
        ],
        detectOutliers,
        outlierPoints,
        inlierPoints,
        vars: {
            q1,
            q3,
            iqr,
            iqrThreshold,
            q1Threshold,
            q3Threshold,
            normalizationHelper,
            config,
            xyStats,
        },
    }
}
