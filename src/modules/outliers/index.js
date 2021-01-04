import { getStdDev } from './getStdDev'
import { getRegression } from '../regression/getRegression'
import { getIntersectionPoint } from './getIntersectionPoint'
import { getPointDistance } from './getPointDistance'
import { getNormalGradient } from './getNormalGradient'
import { getNormalEndPoints } from './getNormalEndPoints'

export const getOutliers = (data, stdDevThreshold = 1) => {
    const stdDevValue = getStdDev(data) * stdDevThreshold
    const reg = getRegression(
        data.slice().sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    )

    const regGradient = reg.equation[0]
    const regEndPoints = [reg.points[0], reg.points[reg.points.length - 1]]
    const normalGradient = getNormalGradient(regGradient)

    const outlierPoints = []
    // const stdDevLines = []

    let intersectionPoint

    data.forEach(dataPoint => {
        intersectionPoint = getIntersectionPoint(
            ...getNormalEndPoints(dataPoint, normalGradient),
            ...regEndPoints
        )

        getPointDistance(dataPoint, intersectionPoint) > stdDevValue &&
            outlierPoints.push(dataPoint)
    })

    return {
        stdDevValue,
        regressionLine: reg.points,
        regressionGradient: regGradient,
        outlierPoints,
        normalGradient,
        // stdDevLines,
    }
}
