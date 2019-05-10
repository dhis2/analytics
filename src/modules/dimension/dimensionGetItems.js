import { DIMENSION_PROP_ID } from './dimension'

export const dimensionGetItems = dimension =>
    DIMENSION_PROP_ID.validate(dimension[DIMENSION_PROP_ID.name])
        ? dimension[DIMENSION_PROP_ID.name]
        : DIMENSION_PROP_ID.defaultValue
