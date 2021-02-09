import { getStdDevMethodHelper, STDDEV } from './stdDev'
import { getQuartileMethodHelper, QUARTILE } from './quartile'
import { normalizerMap, XY_RATIO } from './normalization'
import { getXMinMax } from './minMax'

export const THRESHOLD_FACTOR = 1.5

export const defaultConfig = {
    thresholdFactor: THRESHOLD_FACTOR,
    normalization: XY_RATIO,
    method: QUARTILE,
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

const getOutlierMethodHelper = (dataWithNormalization, config) => {
    switch (config.method) {
        case STDDEV:
            return getStdDevMethodHelper(dataWithNormalization, config)
        case QUARTILE:
        default:
            return getQuartileMethodHelper(dataWithNormalization, config)
    }
}

export const getOutlierHelper = (data, config) =>
    getOutlierMethodHelper(getDataWithNormalization(data, config), {
        ...defaultConfig,
        ...config,
        ...getXMinMax(data),
    })
