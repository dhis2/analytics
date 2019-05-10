import isObject from 'lodash-es/isObject'
import { AXIS } from '../axis/axis'

export const LAYOUT = {
    validate: layout => isObject(layout),
}

// Props

export const LAYOUT_PROP_COLUMNS = {
    name: 'columns',
    defaultValue: [],
    required: true,
    validate: AXIS.validate,
}

export const LAYOUT_PROP_ROWS = {
    name: 'rows',
    defaultValue: [],
    required: false,
    validate: AXIS.validate,
}

export const LAYOUT_PROP_FILTERS = {
    name: 'filters',
    defaultValue: [],
    required: false,
    validate: AXIS.validate,
}

export const LAYOUT_PROPS = [
    LAYOUT_PROP_COLUMNS,
    LAYOUT_PROP_ROWS,
    LAYOUT_PROP_FILTERS,
]
