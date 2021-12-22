import { axisGetAllItems } from './axisGetAllItems.js'
import { layoutGetAllAxes } from './layoutGetAllAxes.js'

export const layoutGetAllItems = layout =>
    layoutGetAllAxes(layout).reduce((allItems, axis) => {
        allItems.push(...axisGetAllItems(axis))
        return allItems
    }, [])
