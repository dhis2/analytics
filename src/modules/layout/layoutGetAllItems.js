import { layoutGetAllAxes } from './layoutGetAllAxes'
import { axisGetAllItems } from './axisGetAllItems'

export const layoutGetAllItems = layout =>
    layoutGetAllAxes(layout).reduce((allItems, axis) => {
        allItems.push(...axisGetAllItems(axis))
        return allItems
    }, [])
