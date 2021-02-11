import { getZScoreHelper, ZSCORE } from './zScore'
import { getIQRHelper, IQR } from './iqr'
import { normalizerMap, XY_RATIO } from './normalization'
import { getXMinMax } from './minMax'

export const THRESHOLD_FACTOR = 1.5

export const defaultConfig = {
    thresholdFactor: THRESHOLD_FACTOR,
    normalization: XY_RATIO,
    method: IQR,
}

const getDataWithNormalization = (
    data,
    config = { normalization: XY_RATIO }
) => {
    const normalizer = normalizerMap[config.normalization]

    if (typeof normalizer !== 'function') {
        throw `Normalization method ${config.normalization} not supported`
    }

    return data
        .map(point => ({
            point,
            normalized: normalizer(point),
        }))
        .sort((a, b) => (a.normalized < b.normalized ? -1 : 1))
}

export const getOutlierHelper = (data, config) => {
    const dataWithNormalization = getDataWithNormalization(data, config)
    const extendedConfig = {
        ...defaultConfig,
        ...getXMinMax(data),
        ...config,
    }

    switch (extendedConfig.method) {
        case ZSCORE:
            return getZScoreHelper(dataWithNormalization, extendedConfig)
        case IQR:
        default:
            return getIQRHelper(dataWithNormalization, extendedConfig)
    }
}
