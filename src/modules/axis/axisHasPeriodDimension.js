import { DIMENSION_ID_PERIOD } from '../dimension/dimension'
import { axisHasDimension } from './axisHasDimension'

export const axisHasDataDimension = axis =>
    axisHasDimension(axis, DIMENSION_ID_PERIOD)
