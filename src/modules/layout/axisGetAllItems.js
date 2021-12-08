import { dimensionGetItems } from './dimensionGetItems'

export const axisGetAllItems = (axis) =>
    axis.reduce((allItems, dimension) => {
        allItems.push(...dimensionGetItems(dimension))
        return allItems
    }, [])
