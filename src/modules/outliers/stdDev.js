import { std, mean } from 'mathjs'

export const getStdDev = (data, normalization) => std(data, normalization)

export const getMean = data => mean(data)

export const getStdDevHelper = (
    data,
    config = {
        thresholdFactor: 1.5,
        isSorted: false,
        normalization: 'unbiased',
    }
) => {
    if (!data.length) {
        throw 'Std dev analysis requires at least one number'
    }
    const sortedData = config.isSorted ? data : data.slice().sort()
    const stdDev = getStdDev(sortedData, config.normalization)
    const stdDevThreshold = stdDev * config.thresholdFactor
    const mean = getMean(sortedData)
    const lowThreshold = mean - stdDevThreshold
    const highThreshold = mean + stdDevThreshold
    const isLowOutlier = value => value < lowThreshold
    const isHighOutlier = value => value > highThreshold
    const isOutlier = value => isLowOutlier(value) || isHighOutlier(value)
    const getOutliers = () =>
        sortedData.reduce((arr, value) => {
            isOutlier(value) && arr.push(value)
            return arr
        }, [])

    return {
        stdDev,
        stdDevThreshold,
        mean,
        lowThreshold,
        highThreshold,
        isLowOutlier,
        isHighOutlier,
        isOutlier,
        getOutliers,
        normalization: config.normalization,
        thresholdFactor: config.thresholdFactor,
        data: sortedData,
    }
}
