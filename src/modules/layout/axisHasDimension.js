import { dimensionIs } from '../dimension/dimensionIs'

export const axisHasDimension = (axis, dimensionId) =>
    Boolean(axis.find(dimension => dimensionIs(dimension, dimensionId)))
