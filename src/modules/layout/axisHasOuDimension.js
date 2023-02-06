import { DIMENSION_ID_ORGUNIT } from '../predefinedDimensions.js'
import { axisHasDimension } from './axisHasDimension.js'

export const axisHasOuDimension = (axis) =>
    axisHasDimension(axis, DIMENSION_ID_ORGUNIT)
