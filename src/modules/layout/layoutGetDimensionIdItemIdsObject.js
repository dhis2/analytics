import { dimensionGetId } from './dimensionGetId'
import { dimensionGetItemIds } from './dimensionGetItemIds'
import { layoutGetAllDimensions } from './layoutGetAllDimensions'

export const layoutGetDimensionIdItemIdsObject = layout =>
    layoutGetAllDimensions(layout).reduce((obj, dimension) => {
        obj[dimensionGetId(dimension)] = dimensionGetItemIds(dimension)
        return obj
    }, {})
