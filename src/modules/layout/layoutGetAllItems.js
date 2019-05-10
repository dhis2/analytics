import { layoutGetAllDimensions } from './layoutGetAllDimensions'

export const layoutGetAllItems = layout =>
    layoutGetAllDimensions(layout).reduce((allItems, dimension) => {
        allItems.push(...dimensionGetItems(dimension))
        return allItems
    }, [])
