import isString from 'lodash-es/isString'

// Dimension prop names
export const ITEM_PROPNAME_ID = 'id'

// Default props
export const ITEM_DEFAULT_PROP_ID = ''

// Props validation
export const itemDefaultPropValidationId = prop => isString(prop)
