import { layoutGetAllItems } from './layoutGetAllItems'
import { itemGetId } from '../item/itemGetId'

export const layoutGetAllItemIds = layout =>
    layoutGetAllItems(layout).map(item => itemGetId(item))
