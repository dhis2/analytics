import { layoutGetDimension } from './layoutGetDimension.js'

export const layoutHasDimension = (layout, dimensionId) =>
    Boolean(layoutGetDimension(layout, dimensionId))
