import { dimensionGetItems } from './dimensionGetItems.js'

export const axisGetAllItems = (axis) =>
    axis.reduce((allItems, dimension) => {
        allItems.push(...dimensionGetItems(dimension))
        return allItems
    }, [])
