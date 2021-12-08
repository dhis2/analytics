import isNumber from 'd2-utilizr/lib/isNumber'
import isNumeric from 'd2-utilizr/lib/isNumeric'
import i18n from '../../locales/index.js'
import { getIQRHelper, IQR } from './iqr'
import { getModZScoreHelper, MODIFIED_Z_SCORE } from './modZScore'
import { getNormalizationHelper, Y_RESIDUALS_LINEAR } from './normalization'
import { getXYStats } from './xyStats'
import { getZScoreHelper, STANDARD_Z_SCORE } from './zScore'

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

const getMinMaxValue = (outlierHelper, isVertical, isMax) => {
    const prop = (isVertical ? 'y' : 'x') + (isMax ? 'Max' : 'Min')
    const extremeValue =
        outlierHelper.extremeLines &&
        outlierHelper.extremeLines[isVertical ? 1 : 0].value
    const extremeFactor =
        isNumber(extremeValue) && isMax
            ? extremeValue + Math.abs(extremeValue) * 0.1
            : extremeValue - Math.abs(extremeValue) * 0.1
    return [
        ...outlierHelper.thresholds.map(
            (t) => getXYStats([t.line[0], t.line[t.line.length - 1]])[prop]
        ),
        extremeFactor,
    ]
        .filter(isNumeric)
        .sort(isMax ? (a, b) => b - a : (a, b) => a - b)[0]
}

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

    if (
        config[PROP_THRESHOLD_FACTOR] <= 0 &&
        [STANDARD_Z_SCORE, MODIFIED_Z_SCORE].includes(
            config[PROP_OUTLIER_METHOD]
        )
    ) {
        return null
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

    // undefined means let highcharts decide
    const lineXMin = getMinMaxValue(helper, false, false)
    helper.xAxisMin =
        lineXMin < 0 && lineXMin < options.xyStats.xMin ? lineXMin : undefined

    const lineYMin = getMinMaxValue(helper, true, false)
    helper.yAxisMin =
        lineYMin < 0 && lineYMin < options.xyStats.yMin ? lineYMin : undefined

    const lineXMax = getMinMaxValue(helper, false, true)
    helper.xAxisMax =
        lineXMax > 0 && lineXMax > options.xyStats.xMax ? lineXMax : undefined

    const lineYMax = getMinMaxValue(helper, true, true)
    helper.yAxisMax =
        lineYMax > 0 && lineYMax > options.xyStats.yMax ? lineYMax : undefined

    return helper
}
