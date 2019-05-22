import { layoutGetAllDimensions } from './layoutGetAllDimensions'
import { dimensionGetItemIds } from './dimensionGetItemIds'
import { dimensionGetId } from './dimensionGetId'

export const layoutGetDimensionIdItemIdsObject = layout =>
    layoutGetAllDimensions(layout).reduce((obj, dimension) => {
        obj[dimensionGetId(dimension)] = dimensionGetItemIds(dimension)
        return obj
    }, {})
