export const dimensionGetItems = dimension =>
    dimensionDefaultPropValidationItems(dimension[DIMENSION_PROPNAME_ITEMS])
        ? dimension[DIMENSION_PROPNAME_ITEMS]
        : DEFAULT_PROPS_ITEMS
