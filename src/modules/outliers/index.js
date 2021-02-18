import { getZScoreHelper, Z_SCORE } from './zScore'
import { getModZScoreHelper, MODIFIED_Z_SCORE } from './modZScore'
import { getIQRHelper, IQR } from './iqr'
import { normalizerMap, XY_RATIO } from './normalization'
import { getXYStats } from './xyStats'

export const THRESHOLD_FACTOR = 1.5

export const defaultConfig = {
    thresholdFactor: THRESHOLD_FACTOR,
    normalizationMethod: XY_RATIO,
    outlierMethod: IQR,
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

    console.log('dataWithNormalization', dataWithNormalization)
    const options = {
        xyStats: getXYStats(data),
    }
    console.log('XYSTATS', options.xyStats)

    switch (config.outlierMethod) {
        case Z_SCORE:
            return getZScoreHelper(dataWithNormalization, config, options)
        case MODIFIED_Z_SCORE:
            return getModZScoreHelper(dataWithNormalization, config, options)
        case IQR:
        default:
            return getIQRHelper(dataWithNormalization, config, options)
    }
}
