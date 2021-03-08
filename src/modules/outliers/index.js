import i18n from '@dhis2/d2-i18n'
import isNumeric from 'd2-utilizr/lib/isNumeric'

import { getZScoreHelper, STANDARD_Z_SCORE } from './zScore'
import { getModZScoreHelper, MODIFIED_Z_SCORE } from './modZScore'
import { getIQRHelper, IQR } from './iqr'
import { getNormalizationHelper, Y_RESIDUALS_LINEAR } from './normalization'
import { getXYStats } from './xyStats'

export const PROP_ENABLED = 'enabled'
export const PROP_THRESHOLD_FACTOR = 'thresholdFactor'
export const PROP_NORMALIZATION_METHOD = 'normalizationMethod'
export const PROP_OUTLIER_METHOD = 'outlierMethod'
export const PROP_EXTREME_LINES = 'extremeLines'
export const PROP_EXTREME_LINES_VALUE = 'value'

export const DEFAULT_ENABLED = false
export const DEFAULT_THRESHOLD_FACTOR = 1.5
export const DEFAULT_NORMALIZATION_METHOD = Y_RESIDUALS_LINEAR
export const DEFAULT_OUTLIER_METHOD = IQR
export const DEFAULT_EXTREME_LINES_VALUE = 1

export const defaultConfig = {
    [PROP_ENABLED]: DEFAULT_ENABLED,
    [PROP_THRESHOLD_FACTOR]: DEFAULT_THRESHOLD_FACTOR,
    [PROP_NORMALIZATION_METHOD]: DEFAULT_NORMALIZATION_METHOD,
    [PROP_OUTLIER_METHOD]: DEFAULT_OUTLIER_METHOD,
    [PROP_EXTREME_LINES]: {
        [PROP_ENABLED]: DEFAULT_ENABLED,
        [PROP_EXTREME_LINES_VALUE]: DEFAULT_EXTREME_LINES_VALUE,
    },
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

const getMinMaxValue = (outlierHelper, prop, sortFn) => [
    [
        ...outlierHelper.thresholds.map(
            t => getXYStats([t.line[0], t.line[t.line.length - 1]])[prop]
        ),
        outlierHelper.extremeLines && outlierHelper.extremeLines[0].value * 1.1,
    ]
        .filter(isNumeric)
        .sort(sortFn)[0],
]

export const getOutlierHelper = (data, userConfig = {}) => {
    if (data.length < 3) {
        return null
    }

    const config = {
        ...defaultConfig,
        ...userConfig,
        [PROP_EXTREME_LINES]: {
            ...defaultConfig[PROP_EXTREME_LINES],
            ...userConfig[PROP_EXTREME_LINES],
        },
    }

    const normalizationHelper = getNormalizationHelper(
        data,
        config.normalizationMethod
    )

    const options = {
        xyStats: getXYStats(data),
    }

    let helper

    switch (config[PROP_OUTLIER_METHOD]) {
        case STANDARD_Z_SCORE:
            helper = getZScoreHelper(normalizationHelper, config, options)
            break
        case MODIFIED_Z_SCORE:
            helper = getModZScoreHelper(normalizationHelper, config, options)
            break
        case IQR:
        default:
            helper = getIQRHelper(normalizationHelper, config, options)
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

    // if data is the highest value return undefined to let highcharts decide
    const lineXMax = getMinMaxValue(helper, 'xMax', (a, b) => b - a)
    helper.xAxisMax = lineXMax > options.xyStats.xMax ? lineXMax : undefined

    const lineYMax = getMinMaxValue(helper, 'yMax', (a, b) => b - a)
    helper.yAxisMax = lineYMax > options.xyStats.yMax ? lineYMax : undefined

    const lineXMin = getMinMaxValue(helper, 'xMin', (a, b) => a - b)
    helper.xAxisMin = lineXMin < options.xyStats.xMin ? lineXMin : undefined

    const lineYMin = getMinMaxValue(helper, 'yMin', (a, b) => a - b)
    helper.yAxisMin = lineYMin < options.xyStats.yMin ? lineYMin : undefined

    return helper
}
