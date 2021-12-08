import { AXIS } from './axis'
import { dimensionIs } from './dimensionIs'

export const axisGetDimension = (axis, dimensionId) =>
    AXIS.isValid(axis) &&
    axis.find((dimension) => dimensionIs(dimension, dimensionId))
