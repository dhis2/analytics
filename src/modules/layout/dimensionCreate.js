import {
    DIMENSION_PROP_ID,
    DIMENSION_PROP_ITEMS,
    DIMENSION_PROP_FILTER,
    DIMENSION_PROP_LEGEND_SET,
    DIMENSION_PROP_REPETITION,
} from './dimension.js'

export const dimensionCreate = (dimensionId, itemIds = [], args = {}) => {
    const dimension = {
        [DIMENSION_PROP_ID.name]: dimensionId,
        ...(itemIds.length && {
            [DIMENSION_PROP_ITEMS.name]: itemIds.map((id) => ({ id })),
        }),
        ...(args.filter && { [DIMENSION_PROP_FILTER.name]: args.filter }),
        ...(args.legendSet && {
            [DIMENSION_PROP_LEGEND_SET.name]: args.legendSet,
        }),
        ...(args.repetition && {
            [DIMENSION_PROP_REPETITION.name]: args.repetition,
        }),
    }
    return dimension
}
