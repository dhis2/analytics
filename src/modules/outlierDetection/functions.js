// Data
export const sortDataX = data => data.slice().sort((x, y) => x[0] > y[0] ? 1 : x[0] < y[0] ? -1 : 0)

// Graphs
const normalInc = 1

export const getNormalEndPoint = (dataPoint, normalGradient) =>
[dataPoint[0] + normalInc, dataPoint[1] + normalInc * normalGradient]

export const getNormalGradient = graphGradient => -1 / graphGradient