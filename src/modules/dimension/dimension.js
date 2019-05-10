import isString from 'lodash-es/isString'

// Dimension ids
export const DIMENSION_ID_DATA = 'dx'
export const DIMENSION_ID_PERIOD = 'pe'
export const DIMENSION_ID_ORGUNIT = 'ou'

// Dimension prop names
export const DIMENSION_PROPNAME_ID = 'dimension'
export const DIMENSION_PROPNAME_ITEMS = 'items'

// Default props
export const DIMENSION_DEFAULT_PROP_ID = ''
export const DIMENSION_DEFAULT_PROP_ITEMS = []

// Props validation
export const dimensionDefaultPropValidationId = prop => isString(prop)
export const dimensionDefaultPropValidationItems = prop => Array.isArray(prop)
