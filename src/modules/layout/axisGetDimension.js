import { dimensionIs } from './dimensionIs'

export const axisGetDimension = (axis, dimensionId) =>
    axis.find(dimension => dimensionIs(dimension, dimensionId))
