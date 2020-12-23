import { intersect, distance, std } from 'mathjs'
import regression from 'regression'
import { getNormalEndPoint, sortDataX } from './functions'

export const getIntersectPoint = (...points) => intersect(points)

export const getPointDistance = (...points) => distance(points)

export const getStdDev = (...data) => std(data)

export const getNormalGraph = (dataPoint, normalGradient) =>
    [dataPoint, getNormalEndPoint(dataPoint, normalGradient)]

export const getRegression = (data, type = 'linear') => {
    switch (type) {
        case 'linear':
        default:
            return regression.linear(sortDataX(data))
    }
}