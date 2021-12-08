import { axisHasDataDimension } from './axisHasDataDimension'
import { layoutGetAllAxes } from './layoutGetAllAxes'

export const layoutHasDataDimension = (layout) =>
    Boolean(layoutGetAllAxes(layout).find((axis) => axisHasDataDimension(axis)))
