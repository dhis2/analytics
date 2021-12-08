import { DIMENSION_PROP_ITEMS } from './dimension'
import { dimensionIsValid } from './dimensionIsValid'

export const dimensionGetItems = (dimension) =>
    dimensionIsValid(dimension, { requireItems: true })
        ? dimension[DIMENSION_PROP_ITEMS.name]
        : DIMENSION_PROP_ITEMS.defaultValue
