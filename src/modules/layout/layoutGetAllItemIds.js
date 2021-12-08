import { itemGetId } from './itemGetId'
import { layoutGetAllItems } from './layoutGetAllItems'

export const layoutGetAllItemIds = (layout) =>
    layoutGetAllItems(layout).map((item) => itemGetId(item))
