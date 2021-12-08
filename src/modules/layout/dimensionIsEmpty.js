import { DIMENSION, DIMENSION_PROP_ITEMS } from './dimension.js'

export const dimensionIsEmpty = (dimension) =>
    !(
        DIMENSION.isValid(dimension) &&
        DIMENSION_PROP_ITEMS.isValid(dimension[DIMENSION_PROP_ITEMS.name]) &&
        dimension[DIMENSION_PROP_ITEMS.name].length
    )
