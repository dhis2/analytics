import { ITEM_PROP_ID } from './item'

export const itemGetId = item =>
    ITEM_PROP_ID.validate(item[ITEM_PROP_ID.name])
        ? item[ITEM_PROP_ID.name]
        : ITEM_PROP_ID.defaultValue
