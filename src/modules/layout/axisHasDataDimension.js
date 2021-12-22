import { DIMENSION_ID_DATA } from '../predefinedDimensions.js'
import { axisHasDimension } from './axisHasDimension.js'

export const axisHasDataDimension = axis =>
    axisHasDimension(axis, DIMENSION_ID_DATA)
