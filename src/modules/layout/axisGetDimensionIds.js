import { AXIS } from './axis'

export const axisGetDimensionIds = axis =>
    AXIS.validate(axis)
        ? axis.map(dimension => dimensionGetId(dimension))
        : AXIS.defaultValue
