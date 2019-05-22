import { layoutGetDimension } from './layoutGetDimension'

export const layoutHasDimension = (layout, dimensionId) =>
    Boolean(layoutGetDimension(layout, dimensionId))
