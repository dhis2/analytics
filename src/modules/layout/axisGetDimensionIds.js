import { AXIS } from './axis.js'
import { dimensionGetId } from './dimensionGetId.js'

export const axisGetDimensionIds = (axis) =>
    AXIS.isValid(axis)
        ? axis.map((dimension) => dimensionGetId(dimension))
        : AXIS.defaultValue
