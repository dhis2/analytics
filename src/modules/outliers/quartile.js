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

export const getQuartileValue = (data, q = 0.25) => {
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

    return data[base - 1] + diff * rest
}

export const getQuartileMethodHelper = (
    data,
    config = {
        thresholdFactor: 1.5,
        isSorted: false,
    }
) => {
    const sortedData = config.isSorted ? data : data.slice().sort()
    const q1 = getQuartileValue(sortedData, 0.25)
    const q3 = getQuartileValue(sortedData, 0.75)
    const iqr = q3 - q1
    const iqrThreshold = iqr * config.thresholdFactor
    const q1Threshold = q1 - iqrThreshold
    const q3Threshold = q3 + iqrThreshold
    const isLowOutlier = value => value < q1Threshold
    const isHighOutlier = value => value > q3Threshold
    const isOutlier = value => isLowOutlier(value) || isHighOutlier(value)
    const getOutliers = () =>
        sortedData.reduce((outliers, value) => {
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
        thresholdFactor: config.thresholdFactor,
        data: sortedData,
    }
}
