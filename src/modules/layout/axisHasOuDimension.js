import { DIMENSION_ID_ORGUNIT } from '../fixedDimensions'
import { axisHasDimension } from './axisHasDimension'

export const axisHasOuDimension = axis =>
    axisHasDimension(axis, DIMENSION_ID_ORGUNIT)
