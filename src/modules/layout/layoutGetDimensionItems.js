import { dimensionGetItems } from './dimensionGetItems'
import { layoutGetDimension } from './layoutGetDimension'

export const layoutGetDimensionItems = (layout, dimensionId) =>
    dimensionGetItems(layoutGetDimension(layout, dimensionId))
