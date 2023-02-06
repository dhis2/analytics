import { axisGetDimension } from './axisGetDimension.js'

export const axisHasDimension = (axis, dimensionId) =>
    Boolean(axisGetDimension(axis, dimensionId))
