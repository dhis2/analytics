import { layoutGetAllDimensions } from './layoutGetAllDimensions'
import { dimensionGetItems } from './dimensionGetItems'

export const layoutGetAllItems = layout =>
    layoutGetAllDimensions(layout).reduce((allItems, dimension) => {
        allItems.push(...dimensionGetItems(dimension))
        return allItems
    }, [])
