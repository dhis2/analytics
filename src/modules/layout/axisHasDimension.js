import { dimensionIs } from './dimensionIs'

export const axisHasDimension = (axis, dimensionId) =>
    Boolean(axis.find(dimension => dimensionIs(dimension, dimensionId)))
