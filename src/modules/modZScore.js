export const MOD_ZSCORE = 'MOD_ZSCORE'

const MAD_CORRECTION = 1.486
const MEANAD_CORRECTION = 1.253314

export const getMean = values =>
    values.reduce((total, value) => total + value, 0) / 2

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

export const getModZScoreByMad0 = (value, median, meanAd) =>
    (value - median) / (meanAd * MEANAD_CORRECTION)

export const getModZScore = (value, median, mad) =>
    (value - median) / (mad * MAD_CORRECTION)

export const getModZScores = values => {
    const median = getMedian(values)
    const mad = getMedianAbsoluteDeviation(values, median)

    if (mad === 0) {
        const mean = getMean(values)
        const meanAd = getMeanAbsoluteDeviation(values, mean)
        return values.map(value => getModZScoreByMad0(value, median, meanAd))
    } else {
        return values.map(value => getModZScore(value, median, mad))
    }
}
