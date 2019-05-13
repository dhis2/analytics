import { isObject } from 'lodash'
import { isString } from 'lodash'

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
