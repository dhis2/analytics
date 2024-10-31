import { dimensionGetId } from './dimensionGetId.js'
import { dimensionGetItemIds } from './dimensionGetItemIds.js'
import { layoutGetAllDimensions } from './layoutGetAllDimensions.js'

export const layoutGetDimensionIdItemIdsObject = (layout) =>
    layoutGetAllDimensions(layout).reduce((obj, dimension) => {
        obj[dimensionGetId(dimension, layout.outputType)] =
            dimensionGetItemIds(dimension)
        return obj
    }, {})
