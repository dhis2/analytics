import { dimensionGetItems } from './dimensionGetItems.js'
import { layoutGetDimension } from './layoutGetDimension.js'

export const layoutGetDimensionItems = (layout, dimensionId) =>
    dimensionGetItems(layoutGetDimension(layout, dimensionId))
