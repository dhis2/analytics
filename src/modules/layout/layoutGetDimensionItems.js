import { layoutGetDimension } from './layoutGetDimension'
import { dimensionGetItems } from './dimensionGetItems'

export const layoutGetDimensionItems = (layout, dimensionId) =>
    dimensionGetItems(layoutGetDimension(layout, dimensionId))
