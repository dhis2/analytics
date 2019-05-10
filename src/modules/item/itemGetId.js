import { ITEM_PROPNAME_ID, ITEM_DEFAULT_PROP_ID } from './item'

export const itemGetId = item =>
    itemDefaultPropValidationId(item[ITEM_PROPNAME_ID])
        ? item[ITEM_PROPNAME_ID]
        : ITEM_DEFAULT_PROP_ID
