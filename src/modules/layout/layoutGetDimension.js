import { dimensionIs } from './dimensionIs'
import { layoutGetAllDimensions } from './layoutGetAllDimensions'

export const layoutGetDimension = (layout, dimensionId) =>
    layoutGetAllDimensions(layout).find((dimension) =>
        dimensionIs(dimension, dimensionId)
    )
