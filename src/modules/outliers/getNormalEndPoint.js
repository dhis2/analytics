const normalInc = 1

export const getNormalEndPoint = (dataPoint, normalGradient) => [
    dataPoint[0] + normalInc,
    dataPoint[1] + normalInc * normalGradient,
]
