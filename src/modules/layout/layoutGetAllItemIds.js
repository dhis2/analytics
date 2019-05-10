export const layoutGetAllItemIds = layout =>
    layoutGetAllItems(layout).map(item => itemGetId(item))
