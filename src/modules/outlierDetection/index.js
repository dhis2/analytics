import { getNormalGradient } from "./functions"
import { getRegression, getStdDev, getNormalGraph, getPointDistance, getIntersectPoint } from "./utils"

export const detectOutliers = (data, stdDevThreshold = 1) => {
    const stdDevValue = getStdDev(data) * stdDevThreshold
    const reg = getRegression(data)
    
    const regGradient = reg.equation[0]
    const regIntersectGraph = [reg.points[0], reg.points[1]]

    const normalGradient = getNormalGradient(regGradient)

    const outlierPoints = []
    // const stdDevGraphs = []

    let normalIntersectGraph
    let intersectPoint
    let pointDistance

    data.forEach(dataPoint => {
        normalIntersectGraph = getNormalGraph(dataPoint, normalGradient)
        intersectPoint = getIntersectPoint([...normalIntersectGraph, ...regIntersectGraph])
        pointDistance = getPointDistance(dataPoint, intersectPoint)

        pointDistance > stdDevValue && (outlierPoints.push(dataPoint))
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