import { DIMENSION_ID_DATA } from '../fixedDimensions'
import { axisHasDimension } from './axisHasDimension'

export const axisHasDataDimension = axis =>
    axisHasDimension(axis, DIMENSION_ID_DATA)
