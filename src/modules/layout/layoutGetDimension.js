import { dimensionIs } from './dimensionIs.js'
import { layoutGetAllDimensions } from './layoutGetAllDimensions.js'

export const layoutGetDimension = (layout, dimensionId) =>
    layoutGetAllDimensions(layout).find(dimension =>
        dimensionIs(dimension, dimensionId)
    )
