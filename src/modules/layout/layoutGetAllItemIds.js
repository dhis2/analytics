import { layoutGetAllItems } from './layoutGetAllItems'
import { itemGetId } from './itemGetId'

export const layoutGetAllItemIds = layout =>
    layoutGetAllItems(layout).map(item => itemGetId(item))
