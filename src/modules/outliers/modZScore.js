export const MOD_Z_SCORE = 'MOD_Z_SCORE'

const MAD_CORRECTION = 0.6745
const MEANAD_CORRECTION = 1.253314

export const getMean = values =>
    values.reduce((total, value) => total + value, 0) / values.length

export const getMedian = values => {
    const hl = values.length / 2
    return hl % 1
        ? values[Math.floor(hl)]
        : getMean([values[hl - 1], values[hl]])
}

export const getMedianAbsoluteDeviation = (
    values,
    median = getMedian(values)
) =>
    getMedian(
        values.map(value => Math.abs(value - median)).sort((a, b) => a - b)
    )

export const getMeanAbsoluteDeviation = (values, mean = getMean(values)) =>
    getMean(values.map(value => Math.abs(value - mean)))

export const getModZScore = (value, median, mad) =>
    (MAD_CORRECTION * (value - median)) / mad

export const getModZScoreMad0 = (value, median, meanAd) =>
    (value - median) / (meanAd * MEANAD_CORRECTION)

export const getModZScoreThresholds = (
    thresholdFactor,
    mad,
    median,
    k = MAD_CORRECTION
) => [
    median - (mad * thresholdFactor) / k,
    median + (mad * thresholdFactor) / k,
]

export const getModZScoreMad0Thresholds = (
    thresholdFactor,
    meanAd,
    median,
    k = MEANAD_CORRECTION
) => [
    median - thresholdFactor * meanAd * k,
    median + thresholdFactor * meanAd * k,
]

export const getDataWithZScore = (dataWithNormalization, cache) => {
    const normalizedData =
        cache.normalizedData || dataWithNormalization.map(obj => obj.normalized)
    const median = cache.median || getMedian(normalizedData)
    const mad = cache.mad || getMedianAbsoluteDeviation()
    let dataWithZScore

    if (mad === 0) {
        const meanAd = cache.meanAd || getMeanAbsoluteDeviation(normalizedData)
        dataWithZScore = dataWithNormalization.map(obj => ({
            ...obj,
            zScore: getModZScoreMad0(obj.normalized, median, meanAd),
        }))
    } else {
        dataWithZScore = dataWithNormalization.map(obj => ({
            ...obj,
            zScore: getModZScore(obj.normalized, median, mad),
        }))
    }

    return dataWithZScore
}

export const getModZScoreHelper = (dataWithNormalization, config) => {
    if (!dataWithNormalization.length) {
        throw 'Std dev analysis requires at least one value'
    }
    const normalizedData = dataWithNormalization.map(obj => obj.normalized)
    const median = getMedian(normalizedData)
    const mad = getMedianAbsoluteDeviation(normalizedData, median)
    const meanAd = mad === 0 ? getMeanAbsoluteDeviation(normalizedData) : null

    const dataWithZScore = getDataWithZScore(dataWithNormalization, {
        normalizedData,
        median,
        mad,
    })

    const [lowThreshold, highThreshold] =
        mad === 0
            ? getModZScoreMad0Thresholds(config.thresholdFactor, meanAd, median)
            : getModZScoreThresholds(config.thresholdFactor, mad, median)

    const isLowOutlier = value => value < lowThreshold
    const isHighOutlier = value => value > highThreshold
    const isOutlier = value => isLowOutlier(value) || isHighOutlier(value)
    const outlierPoints = []
    const inlierPoints = []
    const detectOutliers = () =>
        dataWithZScore.forEach(obj => {
            isOutlier(obj.normalized)
                ? outlierPoints.push(obj.point)
                : inlierPoints.push(obj.point)
        })

    return {
        thresholds: [
            {
                name: `${config.thresholdFactor} x Modified Z-score Low`,
                threshold: lowThreshold,
                // line: q1ThresholdLine,
            },
            {
                name: `${config.thresholdFactor} x Modified Z-score High`,
                threshold: highThreshold,
                // line: q3ThresholdLine,
            },
        ],
        isLowOutlier,
        isHighOutlier,
        isOutlier,
        detectOutliers,
        outlierPoints,
        inlierPoints,
        vars: {
            normalizedData,
            median,
            mad,
            meanAd,
            dataWithNormalization,
            dataWithZScore,
            normalizedData,
            ...config,
        },
    }
}
