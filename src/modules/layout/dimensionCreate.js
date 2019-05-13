import { DIMENSION_PROP_ID, DIMENSION_PROP_ITEMS } from './dimension'

export const dimensionCreate = (dimensionId, itemIds) => ({
    [DIMENSION_PROP_ID]: dimensionId,
    [DIMENSION_PROP_ITEMS]: itemIds.map(id => ({ id })),
})
