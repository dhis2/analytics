import { ITEM_PROP_ID } from './item.js'

export const itemGetId = item =>
    ITEM_PROP_ID.isValid(item[ITEM_PROP_ID.name])
        ? item[ITEM_PROP_ID.name]
        : ITEM_PROP_ID.defaultValue
