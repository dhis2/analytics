const normalInc = 1

const getNormalEndPoint = (dataPoint, normalGradient) => [
    dataPoint[0] + normalInc,
    dataPoint[1] + normalInc * normalGradient,
]

export const getNormalEndPoints = (dataPoint, normalGradient) => [
    dataPoint,
    getNormalEndPoint(dataPoint, normalGradient),
]
