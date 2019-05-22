import { DIMENSION_PROP_ID, DIMENSION_PROP_ITEMS } from './dimension'

export const dimensionCreate = (dimensionId, itemIds) => ({
    [DIMENSION_PROP_ID.name]: dimensionId,
    [DIMENSION_PROP_ITEMS.name]: itemIds.map(id => ({ id })),
})
