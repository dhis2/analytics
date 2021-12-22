import { DIMENSION_ID_PERIOD } from '../predefinedDimensions.js'
import { axisHasDimension } from './axisHasDimension.js'

export const axisHasPeriodDimension = axis =>
    axisHasDimension(axis, DIMENSION_ID_PERIOD)
