import { getStdDevMethodHelper } from './stdDev'
import { getQuartileMethodHelper } from './quartile'
import { normalizerMap } from './normalization'
import { getXMinMax } from './minMax'

export const THRESHOLD_FACTOR = 1.5
export const QUARTILE = 'QUARTILE'
export const STDDEV = 'STDDEV'
export const XY_RATIO = 'XY_RATIO'
export const X_VALUE = 'X_VALUE'
export const Y_VALUE = 'Y_VALUE'

const getOutlierMethodHelper = (
    dataWithNormalization,
    config = {
        normalization: XY_RATIO,
        method: QUARTILE,
        thresholdFactor: THRESHOLD_FACTOR,
    }
) => {
    switch (config.method) {
        case STDDEV:
            return getStdDevMethodHelper(dataWithNormalization, config)
        case QUARTILE:
        default:
            return getQuartileMethodHelper(dataWithNormalization, config)
    }
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

export const getOutlierHelper = (
    data,
    config = {
        normalization: XY_RATIO,
        method: QUARTILE,
        thresholdFactor: THRESHOLD_FACTOR,
    }
) =>
    getOutlierMethodHelper(getDataWithNormalization(data, config), {
        ...config,
        ...getXMinMax(data),
    })
