import { getStdDev } from './getStdDev'
import { getRegression } from './getRegression'
import { getIntersectionPoint } from './getIntersectionPoint'
import { getPointDistance } from './getPointDistance'
import { getNormalGradient } from './getNormalGradient'
import { getNormalGraph } from './getNormalGraph'

export default (data, stdDevThreshold = 1) => {
    const stdDevValue = getStdDev(data) * stdDevThreshold
    const reg = getRegression(data)

    const regGradient = reg.equation[0]
    const regIntersectionGraph = [reg.points[0], reg.points[1]]
    const normalGradient = getNormalGradient(regGradient)

    const outlierPoints = []
    // const stdDevGraphs = []

    let normalIntersectionGraph
    let intersectPoint
    let pointDistance

    data.forEach(dataPoint => {
        normalIntersectionGraph = getNormalGraph(dataPoint, normalGradient)
        intersectPoint = getIntersectionPoint([
            ...normalIntersectionGraph,
            ...regIntersectionGraph,
        ])
        pointDistance = getPointDistance(dataPoint, intersectPoint)

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
