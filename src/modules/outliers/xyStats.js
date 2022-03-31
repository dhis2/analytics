// most performant way of getting min and max
export const getXYStats = (points) => {
    let xMin = points[0][0]
    let xMax = xMin
    let yMin = points[0][1]
    let yMax = yMin
    let xSum = xMin
    let ySum = yMin
    let i
    let x
    let y

    for (i = 1; i < points.length; i++) {
        x = points[i][0]
        y = points[i][1]
        xSum += x
        ySum += y
        xMin = x < xMin ? x : xMin
        xMax = x > xMax ? x : xMax
        yMin = y < yMin ? y : yMin
        yMax = y > yMax ? y : yMax
    }

    return {
        xSum,
        ySum,
        xMin,
        xMax,
        yMin,
        yMax,
    }
}
