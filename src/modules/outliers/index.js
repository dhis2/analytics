import { getStdDevMethodHelper } from './stdDev'
import { getQuartileMethodHelper } from './quartile'
import { getXValueData } from './xValue'
import { getYValueData } from './yValue'
import { getXyRatioData } from './xyRatio'

export const THRESHOLD_FACTOR = 1.5
export const QUARTILE = 'QUARTILE'
export const STDDEV = 'STDDEV'
export const XY_RATIO = 'XY_RATIO'
export const X_VALUE = 'X_VALUE'
export const Y_VALUE = 'Y_VALUE'

const getOutlierMethodHelper = (
    data,
    config = { method: QUARTILE, thresholdFactor: THRESHOLD_FACTOR }
) => {
    switch (config.method) {
        case STDDEV:
            return getStdDevMethodHelper(data, config)
        case QUARTILE:
        default:
            return getQuartileMethodHelper(data, config)
    }
}

const getNormalizedData = (data, config = { method: XY_RATIO }) => {
    switch (config.method) {
        case X_VALUE:
            return getXValueData(data)
        case Y_VALUE:
            return getYValueData(data)
        case XY_RATIO:
        default:
            return getXyRatioData(data)
    }
}

export const getOutlierHelper = (
    data,
    config = {
        normalization: XY_RATIO,
        method: QUARTILE,
        thresholdFactor: THRESHOLD_FACTOR,
    }
) => getOutlierMethodHelper(getNormalizedData(data, config), config)
