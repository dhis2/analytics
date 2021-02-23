import { getZScoreHelper, STANDARD_Z_SCORE } from './zScore'
import { getModZScoreHelper, MODIFIED_Z_SCORE } from './modZScore'
import { getIQRHelper, IQR } from './iqr'
import { normalizerMap, XY_RATIO } from './normalization'
import { getXYStats } from './xyStats'

export const THRESHOLD_FACTOR = 1.5

export const defaultConfig = {
    thresholdFactor: THRESHOLD_FACTOR,
    normalizationMethod: XY_RATIO,
    outlierMethod: IQR,
    extremePercentage: 1,
}

const getDataWithNormalization = (data, normalizationMethod) => {
    const normalizer = normalizerMap[normalizationMethod]

    if (typeof normalizer !== 'function') {
        throw `Normalization method ${normalizationMethod} not supported`
    }

    return data
        .map(point => ({
            point,
            normalized: normalizer(point),
        }))
        .sort((a, b) => (a.normalized < b.normalized ? -1 : 1))
}

const getExtremes = (extremePercentage, xyStats) => {
    const xExtremeValue = xyStats.xSum * (extremePercentage / 100)
    const yExtremeValue = xyStats.ySum * (extremePercentage / 100)

    return [
        {
            name: `${extremePercentage}% of Total X Values`,
            value: xExtremeValue,
            isVertical: true,
        },
        {
            name: `${extremePercentage}% of Total Y Values`,
            value: yExtremeValue,
        },
    ]
}

export const getOutlierHelper = (data, userConfig) => {
    const config = {
        ...defaultConfig,
        ...userConfig,
    }
    console.log('DATA', data)
    console.log('CONFIG', config)

    const dataWithNormalization = getDataWithNormalization(
        data,
        config.normalizationMethod
    )

    const options = {
        xyStats: getXYStats(data),
    }

    let helper

    switch (config.outlierMethod) {
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

    helper.extremes = getExtremes(config.extremePercentage, options.xyStats)
    console.log('HELPER', helper)
    return helper
}
