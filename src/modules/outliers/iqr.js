import i18n from '@dhis2/d2-i18n'

import { PROP_NORMALIZATION_METHOD, PROP_THRESHOLD_FACTOR } from './index'
import { denormalizerMap } from './normalization'

export const IQR = 'IQR'

export const getQuartilePosition = (data, quartile) => {
    const pos = (data.length + 1) / 4

    switch (quartile) {
        case 0.75:
            return pos * 3
        case 0.5:
            return pos * 2
        case 0.25:
        default:
            return pos
    }
}

export const getQuartileValue = (data, quartile = 0.25) => {
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

export const getIQRHelper = (dataWithNormalization, config, { xyStats }) => {
    const normalizedData = dataWithNormalization.map(obj => obj.normalized)
    const q1 = getQuartileValue(normalizedData, 0.25)
    const q3 = getQuartileValue(normalizedData, 0.75)
    const iqr = q3 - q1
    const iqrThreshold = iqr * config[PROP_THRESHOLD_FACTOR]
    const q1Threshold = q1 - iqrThreshold
    const q3Threshold = q3 + iqrThreshold
    const denormalizer = denormalizerMap[config[PROP_NORMALIZATION_METHOD]]
    const q1ThresholdLine = [
        [xyStats.xMin, denormalizer(xyStats.xMin, q1Threshold)],
        [xyStats.xMax, denormalizer(xyStats.xMax, q1Threshold)],
    ]
    const q3ThresholdLine = [
        [xyStats.xMin, denormalizer(xyStats.xMin, q3Threshold)],
        [xyStats.xMax, denormalizer(xyStats.xMax, q3Threshold)],
    ]
    const isLowOutlier = value => value < q1Threshold
    const isHighOutlier = value => value > q3Threshold
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
        isLowOutlier,
        isHighOutlier,
        isOutlier,
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
            dataWithNormalization,
            normalizedData,
            config,
            xyStats,
        },
    }
}
