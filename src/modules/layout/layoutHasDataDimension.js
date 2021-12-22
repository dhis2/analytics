import { axisHasDataDimension } from './axisHasDataDimension.js'
import { layoutGetAllAxes } from './layoutGetAllAxes.js'

export const layoutHasDataDimension = layout =>
    Boolean(layoutGetAllAxes(layout).find(axis => axisHasDataDimension(axis)))
