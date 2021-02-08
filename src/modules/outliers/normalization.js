// XY ratio

const getXyRatio = point => point[0] / point[1]
const getXyRatioY = (x, ratio) => x / ratio

// X value

const getXValue = point => point[0]

// Y value

const getYValue = point => point[1]

// Maps

export const normalizerMap = {
    [XY_RATIO]: getXyRatio,
    [X_VALUE]: getXValue,
    [Y_VALUE]: getYValue,
}

export const deNormalizerMap = {
    [XY_RATIO]: getXyRatioY,
}
