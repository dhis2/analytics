import { getStdDev } from './getStdDev'
import { getRegression } from '../regression/getRegression'
import { getIntersectionPoint } from './getIntersectionPoint'
import { getPointDistance } from './getPointDistance'
import { getNormalGradient } from './getNormalGradient'
import { getNormalEndPoints } from './getNormalEndPoints'

export const getOutliers = (data, stdDevThreshold = 1) => {
    const stdDev = getStdDev(data)
    const stdDevValue = stdDev * stdDevThreshold
    const reg = getRegression(
        data.slice().sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    )

    const regGradient = reg.equation[0]
    const regEndPoints = [reg.points[0], reg.points[reg.points.length - 1]]
    const normalGradient = getNormalGradient(regGradient)

    const outlierPoints = []
    const allPointsExceptOutliers = []
    // const stdDevLines = []

    let intersectionPoint

    data.forEach(dataPoint => {
        intersectionPoint = getIntersectionPoint(
            ...getNormalEndPoints(dataPoint, normalGradient),
            ...regEndPoints
        )
        console.log(
            dataPoint,
            intersectionPoint,
            stdDevValue,
            getPointDistance(dataPoint, intersectionPoint) > stdDevValue
        )
        if (getPointDistance(dataPoint, intersectionPoint) > stdDevValue) {
            outlierPoints.push(dataPoint)
        } else {
            allPointsExceptOutliers.push(dataPoint)
        }
    })

    return {
        stdDev: {
            unit: stdDev,
            threshold: stdDevThreshold,
            value: stdDev * stdDevThreshold,
        },
        regression: {
            points: reg.points,
            gradient: regGradient,
        },
        normal: {
            gradient: normalGradient,
        },
        points: {
            all: data,
            outliers: outlierPoints,
            allExceptOutliers: allPointsExceptOutliers,
        },
        // stdDevLines,
    }
}
