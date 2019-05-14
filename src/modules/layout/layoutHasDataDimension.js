import { layoutGetAllAxes } from './layoutGetAllAxes'
import { axisHasDataDimension } from './axisHasDataDimension'

export const layoutHasDataDimension = layout =>
    Boolean(layoutGetAllAxes(layout).find(axis => axisHasDataDimension(axis)))
