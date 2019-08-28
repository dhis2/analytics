import { DIMENSION, DIMENSION_PROP_ITEMS } from './dimension'
import { dimensionIsValid } from './dimensionIsValid'

export const dimensionGetItems = dimension =>
    dimensionIsValid(dimension)
        ? dimension[DIMENSION_PROP_ITEMS.name]
        : DIMENSION_PROP_ITEMS.defaultValue
