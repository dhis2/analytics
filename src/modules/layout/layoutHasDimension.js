import { layoutGetAllDimensions } from './layoutGetAllDimensions'
import { dimensionIs } from './dimensionIs'

export const layoutHasDimension = (layout, dimensionId) =>
    Boolean(
        layoutGetAllDimensions(layout).find(dimension =>
            dimensionIs(dimension, dimensionId)
        )
    )
