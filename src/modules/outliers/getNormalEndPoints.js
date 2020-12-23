const normalInc = 1

export const getNormalEndPoints = (dataPoint, normalGradient) => [
    dataPoint,
    [
        dataPoint[0] + normalInc,
        dataPoint[1] + normalInc * normalGradient,
    ],
]