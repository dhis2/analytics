// most performant way of getting min and max
export const getXMinMax = points => {
    let xMin = (xMax = points[0][0])
    let i
    let x

    for (i = 1; i < points.length; i++) {
        x = points[i][0]
        xMin = x < xMin ? x : xMin
        xMax = x > xMax ? x : xMax
    }

    return {
        xMin,
        xMax,
    }
}
