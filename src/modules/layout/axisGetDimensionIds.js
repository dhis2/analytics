import { AXIS } from './axis'
import { dimensionGetId } from './dimensionGetId'

export const axisGetDimensionIds = axis =>
    AXIS.validate(axis)
        ? axis.map(dimension => dimensionGetId(dimension))
        : AXIS.defaultValue
