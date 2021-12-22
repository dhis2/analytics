import { axisHasPeriodDimension } from './axisHasPeriodDimension.js'
import { layoutGetAllAxes } from './layoutGetAllAxes.js'

export const layoutHasPeriodDimension = layout =>
    Boolean(layoutGetAllAxes(layout).find(axis => axisHasPeriodDimension(axis)))
