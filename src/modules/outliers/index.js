import i18n from '@dhis2/d2-i18n'

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

export const DEFAULT_ENABLED = true
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
    const xExtremeValue = xyStats.xSum * (percentage / 100)
    const yExtremeValue = xyStats.ySum * (percentage / 100)

    return [
        {
            name: i18n.t('{{percentage}}% of Total X Values', {
                percentage,
            }),
            value: xExtremeValue,
            isVertical: true,
        },
        {
            name: i18n.t('{{percentage}}% of Total Y Values', {
                percentage,
            }),
            value: yExtremeValue,
        },
    ]
}

export const getOutlierHelper = (data, userConfig) => {
    const config = {
        ...defaultConfig,
        ...userConfig,
    }
    // console.log('DATA', data)
    // console.log('CONFIG', config)

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

    helper[PROP_EXTREME_LINES] = getExtremeLines(
        config[PROP_EXTREME_LINES][PROP_EXTREME_LINES_VALUE],
        options.xyStats
    )

    // console.log('HELPER', helper)
    return helper
}
