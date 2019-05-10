import isString from 'lodash-es/isString'

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

// Dimension ids

export const DIMENSION_ID_DATA = 'dx'
export const DIMENSION_ID_PERIOD = 'pe'
export const DIMENSION_ID_ORGUNIT = 'ou'
