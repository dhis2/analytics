import { layoutGetAllDimensions } from './layoutGetAllDimensions'
import { dimensionIs } from './dimensionIs'

export const layoutGetDimension = (layout, dimensionId) =>
    layoutGetAllDimensions(layout).find(dimension =>
        dimensionIs(dimension, dimensionId)
    )
