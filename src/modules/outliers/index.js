import i18n from '@dhis2/d2-i18n'
import isNumeric from 'd2-utilizr/lib/isNumeric'

import { getZScoreHelper, STANDARD_Z_SCORE } from './zScore'
import { getModZScoreHelper, MODIFIED_Z_SCORE } from './modZScore'
import { getIQRHelper, IQR } from './iqr'
import { normalizerMap, XY_RATIO } from './normalization'
import { getXYStats } from './xyStats'

export const PROP_ENABLED = 'enabled'
export const PROP_THRESHOLD_FACTOR = 'thresholdFactor'
export const PROP_NORMALIZATION_METHOD = 'normalizationMethod'
export const PROP_OUTLIER_METHOD = 'outlierMethod'
export const PROP_EXTREME_LINES = 'extremeLines'
export const PROP_EXTREME_LINES_VALUE = 'value'

export const DEFAULT_ENABLED = false
export const DEFAULT_THRESHOLD_FACTOR = 1.5
export const DEFAULT_NORMALIZATION_METHOD = XY_RATIO
export const DEFAULT_OUTLIER_METHOD = IQR
export const DEFAULT_EXTREME_LINES_VALUE = 1

export const defaultConfig = {
    [PROP_ENABLED]: DEFAULT_ENABLED,
    [PROP_THRESHOLD_FACTOR]: DEFAULT_THRESHOLD_FACTOR,
    [PROP_NORMALIZATION_METHOD]: XY_RATIO,
    [PROP_OUTLIER_METHOD]: IQR,
    [PROP_EXTREME_LINES]: {
        [PROP_ENABLED]: DEFAULT_ENABLED,
        [PROP_EXTREME_LINES_VALUE]: DEFAULT_EXTREME_LINES_VALUE,
    },
}

const getDataWithNormalization = (data, normalizationMethod) => {
    const normalizer = normalizerMap[normalizationMethod]

    return data
        .map(point => ({
            point,
            normalized: normalizer(point),
        }))
        .sort((a, b) => (a.normalized < b.normalized ? -1 : 1))
}

const getExtremeLines = (percentage, xyStats) => {
    const lines = []

    if (!isNumeric(percentage)) {
        return lines
    }

    const xExtremeValue = xyStats.xSum * (percentage / 100)
    const yExtremeValue = xyStats.ySum * (percentage / 100)

    lines.push({
        name: i18n.t('{{percentage}}% of total x values', {
            percentage,
        }),
        value: xExtremeValue,
        isVertical: true,
    })

    lines.push({
        name: i18n.t('{{percentage}}% of total y values', {
            percentage,
        }),
        value: yExtremeValue,
    })

    return lines
}

export const getOutlierHelper = (data, userConfig = {}) => {
    const config = {
        ...defaultConfig,
        ...userConfig,
        [PROP_EXTREME_LINES]: {
            ...defaultConfig[PROP_EXTREME_LINES],
            ...userConfig[PROP_EXTREME_LINES],
        },
    }

    const dataWithNormalization = getDataWithNormalization(
        data,
        config.normalizationMethod
    )

    const options = {
        xyStats: getXYStats(data),
    }

    let helper

    switch (config[PROP_OUTLIER_METHOD]) {
        case STANDARD_Z_SCORE:
            helper = getZScoreHelper(dataWithNormalization, config, options)
            break
        case MODIFIED_Z_SCORE:
            helper = getModZScoreHelper(dataWithNormalization, config, options)
            break
        case IQR:
        default:
            helper = getIQRHelper(dataWithNormalization, config, options)
    }

    if (
        config[PROP_EXTREME_LINES][PROP_ENABLED] &&
        isNumeric(config[PROP_EXTREME_LINES][PROP_EXTREME_LINES_VALUE])
    ) {
        helper.extremeLines = getExtremeLines(
            config[PROP_EXTREME_LINES][PROP_EXTREME_LINES_VALUE],
            options.xyStats
        )
    }

    const lineXMax = [
        helper.thresholds[0].line[0][0],
        helper.thresholds[0].line[1][0],
        helper.thresholds[1].line[0][0],
        helper.thresholds[1].line[1][0],
        helper.extremeLines && helper.extremeLines[0].value * 1.1,
    ]
        .filter(isNumeric)
        .sort((a, b) => b - a)[0]

    helper.xAxisMax = lineXMax > options.xyStats.xMax ? lineXMax : undefined

    const lineYMax = [
        helper.thresholds[0].line[0][1],
        helper.thresholds[0].line[1][1],
        helper.thresholds[1].line[0][1],
        helper.thresholds[1].line[1][1],
        helper.extremeLines && helper.extremeLines[1].value * 1.1,
    ]
        .filter(isNumeric)
        .sort((a, b) => b - a)[0]

    helper.yAxisMax = lineYMax > options.xyStats.yMax ? lineYMax : undefined

    const lineXMin = [
        helper.thresholds[0].line[0][0],
        helper.thresholds[0].line[1][0],
        helper.thresholds[1].line[0][0],
        helper.thresholds[1].line[1][0],
    ].sort((a, b) => a - b)[0]

    helper.xAxisMin = lineXMin < options.xyStats.xMin ? lineXMin : undefined

    const lineYMin = [
        helper.thresholds[0].line[0][1],
        helper.thresholds[0].line[1][1],
        helper.thresholds[1].line[0][1],
        helper.thresholds[1].line[1][1],
    ].sort((a, b) => a - b)[0]

    helper.yAxisMin = lineYMin < options.xyStats.yMin ? lineYMin : undefined

    return helper
}
