import { dimensionIs } from './dimensionIs'
import { AXIS } from './axis'

export const axisGetDimension = (axis, dimensionId) =>
    AXIS.isValid(axis) &&
    axis.find(dimension => dimensionIs(dimension, dimensionId))
