import { getStdDev } from './getStdDev'
import { getRegression } from './getRegression'
import { getIntersectionPoint } from './getIntersectionPoint'
import { getPointDistance } from './getPointDistance'
import { getNormalGradient } from './getNormalGradient'
import { getNormalEndPoints } from './getNormalEndPoints'

export default (data, stdDevThreshold = 1) => {
    const stdDevValue = getStdDev(data) * stdDevThreshold
    const reg = getRegression(data)

    const regGradient = reg.equation[0]
    const regEndPoints = [reg.points[0], reg.points[reg.points.length - 1]]
    const normalGradient = getNormalGradient(regGradient)

    const outlierPoints = []
    // const stdDevGraphs = []

    let normalEndPoints
    let intersectionPoint
    let pointDistance

    data.forEach(dataPoint => {
        normalEndPoints = getNormalEndPoints(dataPoint, normalGradient)
        intersectionPoint = getIntersectionPoint([
            ...normalEndPoints,
            ...regEndPoints,
        ])
        pointDistance = getPointDistance(dataPoint, intersectionPoint)

        pointDistance > stdDevValue && outlierPoints.push(dataPoint)
    })

    return {
        stdDevValue,
        regressionGraph: reg.points,
        regressionGradient: regGradient,
        outlierPoints,
        normalGradient,
        // stdDevGraphs,
    }
}
