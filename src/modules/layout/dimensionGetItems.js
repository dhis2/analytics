import { DIMENSION_PROP_ITEMS } from './dimension.js'
import { dimensionIsValid } from './dimensionIsValid.js'

export const dimensionGetItems = (dimension) =>
    dimensionIsValid(dimension, { requireItems: true })
        ? dimension[DIMENSION_PROP_ITEMS.name]
        : DIMENSION_PROP_ITEMS.defaultValue
