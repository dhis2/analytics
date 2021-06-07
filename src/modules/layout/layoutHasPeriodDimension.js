import { axisHasPeriodDimension } from './axisHasPeriodDimension'
import { layoutGetAllAxes } from './layoutGetAllAxes'

export const layoutHasPeriodDimension = layout =>
    Boolean(layoutGetAllAxes(layout).find(axis => axisHasPeriodDimension(axis)))
