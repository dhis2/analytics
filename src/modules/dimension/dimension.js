import isObject from 'lodash-es/isObject'

// Dimension

export const DIMENSION = {
    validate: dimension => isObject(dimension),
}

// Props

export const DIMENSION_PROP_ID = {
    name: 'dimension',
    defaultValue: '',
    required: true,
    validate: prop => isString(prop),
}

export const DIMENSION_PROP_ITEMS = {
    name: 'items',
    defaultValue: [],
    required: false,
    validate: prop => Array.isArray(prop),
}

export const DIMENSION_PROPS = [DIMENSION_PROP_ID, DIMENSION_PROP_ITEMS]

// Dimension ids

export const DIMENSION_ID_DATA = 'dx'
export const DIMENSION_ID_PERIOD = 'pe'
export const DIMENSION_ID_ORGUNIT = 'ou'

export const FIXED_DIMENSION_IDS = [
    DIMENSION_ID_DATA,
    DIMENSION_ID_PERIOD,
    DIMENSION_ID_ORGUNIT,
]
