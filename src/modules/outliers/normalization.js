export const XY_RATIO = 'XY_RATIO'
export const X_VALUE = 'X_VALUE'
export const Y_VALUE = 'Y_VALUE'

const getXyRatio = point => point[0] / point[1]
const getXyRatioY = (x, ratio) => x / ratio

const getXValue = point => point[0]
const getYValue = point => point[1]

export const normalizerMap = {
    [XY_RATIO]: getXyRatio,
    [X_VALUE]: getXValue,
    [Y_VALUE]: getYValue,
}

export const denormalizerMap = {
    [XY_RATIO]: getXyRatioY,
}
