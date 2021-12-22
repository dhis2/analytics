import isObject from 'lodash/isObject'
import isString from 'lodash/isString'

// Dimension

export const DIMENSION = {
    isValid: (dimension) => isObject(dimension),
}

// Props

export const DIMENSION_PROP_ID = {
    name: 'dimension',
    defaultValue: '',
    required: true,
    isValid: (prop) => isString(prop),
}

export const DIMENSION_PROP_ITEMS = {
    name: 'items',
    defaultValue: [],
    required: false,
    isValid: (prop) => Array.isArray(prop),
}

export const DIMENSION_PROP_FILTER = {
    name: 'filter',
    defaultValue: [],
    required: false,
    isValid: (prop) => isString(prop),
}

export const DIMENSION_PROP_LEGEND_SET = {
    name: 'legendSet',
    defaultValue: [],
    required: false,
    isValid: (prop) => isString(prop),
}

export const DIMENSION_PROPS = [
    DIMENSION_PROP_ID,
    DIMENSION_PROP_ITEMS,
    DIMENSION_PROP_FILTER,
    DIMENSION_PROP_LEGEND_SET,
]
