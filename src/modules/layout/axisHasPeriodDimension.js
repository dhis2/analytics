import { DIMENSION_ID_PERIOD } from '../fixedDimensions'
import { axisHasDimension } from './axisHasDimension'

export const axisHasPeriodDimension = axis =>
    axisHasDimension(axis, DIMENSION_ID_PERIOD)
