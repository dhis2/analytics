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
    percentile: 1,
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

const getPercentiles = (percentile, xyStats) => {
    const xPercentileValue = xyStats.xSum * (percentile / 100)
    const yPercentileValue = xyStats.ySum * (percentile / 100)

    return [
        {
            name: `${percentile}% of Total X Values`,
            value: xPercentileValue,
            line: [
                [xPercentileValue, xyStats.yMin],
                [xPercentileValue, xyStats.yMax],
            ],
        },
        {
            name: `${percentile}% of Total Y Values`,
            value: yPercentileValue,
            line: [
                [xyStats.xMin, yPercentileValue],
                [xyStats.xMax, yPercentileValue],
            ],
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
        case Z_SCORE:
            helper = getZScoreHelper(dataWithNormalization, config, options)
            break
        case MODIFIED_Z_SCORE:
            helper = getModZScoreHelper(dataWithNormalization, config, options)
            break
        case IQR:
        default:
            helper = getIQRHelper(dataWithNormalization, config, options)
    }

    helper.percentiles = getPercentiles(config.percentile, options.xyStats)
    console.log('HELPER', helper)
    return helper
}
