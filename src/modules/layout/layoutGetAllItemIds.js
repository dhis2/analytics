import { itemGetId } from './itemGetId.js'
import { layoutGetAllItems } from './layoutGetAllItems.js'

export const layoutGetAllItemIds = layout =>
    layoutGetAllItems(layout).map(item => itemGetId(item))
