export const MODZSCORE = 'MODZSCORE'

const MAD_CORRECT = 1.486
const MEANAD_CORRECTION = 1.253314

export const getMean = values =>
    values.reduce((total, value) => total + value, 0) / 2

export const getMedian = values => {
    const hl = values.length / 2
    return hl % 1
        ? values[Math.floor(hl)]
        : getMean([values[hl - 1], values[hl]])
}

export const getMedianAbsoluteDeviation = values => {
    const median = getMedian(values)
    return getMedian(values.map(value => Math.abs(value - median)))
}

export const getMeanAbsoluteDeviation = values => {
    const mean = getMean(values)
    return getMean(values.map(value => Math.abs(value - median)))
}

export const getModZScore = values => {
    const mad = getMedianAbsoluteDeviation(values)

    if (mad === 0) {
        const meanAD = getMeanAbsoluteDeviation(values)
    }
}
