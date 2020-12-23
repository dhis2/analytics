import { getNormalEndPoint } from './getNormalEndPoint'

export const getNormalGraph = (dataPoint, normalGradient) => [
    dataPoint,
    getNormalEndPoint(dataPoint, normalGradient),
]
