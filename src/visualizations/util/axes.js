export const getAxis = (axes, axisType, axisIndex) =>
    axes.find(axis => axis.type === axisType && axis.index === axisIndex) || {}
