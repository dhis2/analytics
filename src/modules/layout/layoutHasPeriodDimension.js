import { layoutGetAllAxes } from './layoutGetAllAxes'
import { axisHasPeriodDimension } from './axisHasPeriodDimension'

export const layoutHasPeriodDimension = layout =>
    Boolean(layoutGetAllAxes(layout).find(axis => axisHasPeriodDimension(axis)))
