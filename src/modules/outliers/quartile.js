export const getQuartilePosition = (data, q) => {
    const pos = (data.length + 1) / 4

    switch (q) {
        case 0.75:
            return pos * 3
        case 0.5:
            return pos * 2
        case 0.25:
        default:
            return pos
    }
}

export const getQuartile = (data, q = 0.25) => {
    if (data.length < 3) {
        return
    }

    const pos = getQuartilePosition(data, q)
    const rest = pos % 1

    if (rest === 0) {
        return data[pos - 1]
    }

    var base = Math.floor(pos)
    var diff = data[base] - data[base - 1]

    return base + diff * rest
}

export const getQuartileUtils = (data, thresholdFactor) => {
    const q1 = getQuartile(data, 0.25)
    const q3 = getQuartile(data, 0.75)
    const iqr = q3 - q1
    const iqrThreshold = iqr * thresholdFactor
    const q1Threshold = q1 - iqrThreshold
    const q3Threshold = q3 + iqrThreshold
    const isLowOutlier = value => value < q1Threshold
    const isHighOutlier = value => value > q3Threshold
    const isOutlier = value => isLowOutlier(value) || isHighOutlier(value)
    const getOutliers = () =>
        data.reduce((outliers, value) => {
            isOutlier(value) && outliers.push(value)
            return outliers
        }, [])

    return {
        q1,
        q3,
        iqr,
        iqrThreshold,
        q1Threshold,
        q3Threshold,
        isLowOutlier,
        isHighOutlier,
        isOutlier,
        getOutliers,
    }
}

export const getOutliersByQuartile = (
    data,
    thresholdFactor,
    config = { isSorted: false }
) => {
    const sortedData = isSorted ? data : data.slice().sort()

    const utils = getQuartileUtils(sortedData, thresholdFactor)

    return utils.getOutliers()
}
