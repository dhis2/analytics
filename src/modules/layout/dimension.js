import isObject from 'lodash/isObject'
import isString from 'lodash/isString'

// Dimension

export const DIMENSION = {
    isValid: dimension => isObject(dimension),
}

// Props

export const DIMENSION_PROP_ID = {
    name: 'dimension',
    defaultValue: '',
    required: true,
    isValid: prop => isString(prop),
}

export const DIMENSION_PROP_ITEMS = {
    name: 'items',
    defaultValue: [],
    required: false,
    isValid: prop => Array.isArray(prop),
}

export const DIMENSION_PROPS = [DIMENSION_PROP_ID, DIMENSION_PROP_ITEMS]
