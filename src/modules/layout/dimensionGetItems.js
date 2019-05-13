import { DIMENSION_PROP_ITEMS } from './dimension'

export const dimensionGetItems = dimension =>
    DIMENSION_PROP_ITEMS.validate(dimension[DIMENSION_PROP_ITEMS.name])
        ? dimension[DIMENSION_PROP_ITEMS.name]
        : DIMENSION_PROP_ITEMS.defaultValue
