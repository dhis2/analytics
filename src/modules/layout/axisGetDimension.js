import { AXIS } from './axis.js'
import { dimensionIs } from './dimensionIs.js'

export const axisGetDimension = (axis, dimensionId) =>
    AXIS.isValid(axis) &&
    axis.find((dimension) => dimensionIs(dimension, dimensionId))
