import { axisGetAllItems } from './axisGetAllItems'
import { layoutGetAllAxes } from './layoutGetAllAxes'

export const layoutGetAllItems = layout =>
    layoutGetAllAxes(layout).reduce((allItems, axis) => {
        allItems.push(...axisGetAllItems(axis))
        return allItems
    }, [])
