import { AXIS } from './axis.js'
import { dimensionGetId } from './dimensionGetId.js'

export const axisGetDimensionIds = (axis, outputType) =>
    AXIS.isValid(axis)
        ? axis.map((dimension) => dimensionGetId(dimension, outputType))
        : AXIS.defaultValue
