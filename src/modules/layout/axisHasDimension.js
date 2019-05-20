import { axisGetDimension } from './axisGetDimension'

export const axisHasDimension = (axis, dimensionId) =>
    Boolean(axisGetDimension(axis, dimensionId))
