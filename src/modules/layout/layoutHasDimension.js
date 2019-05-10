import { dimensionIs } from '../dimension/dimensionIs'

export const layoutHasDimension = (layout, dimensionId) =>
    layoutGetAllDimensions(layout).find(dimension =>
        dimensionIs(dimension, dimensionId)
    )
