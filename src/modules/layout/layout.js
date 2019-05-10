import isObject from 'lodash-es/isObject'
import { AXIS } from '../axis/axis'

export const LAYOUT = {
    validate: layout => isObject(layout),
}

// Props

export const LAYOUT_PROP_COLUMNS = {
    name: 'columns',
    validate: AXIS.validate,
}

export const LAYOUT_PROP_ROWS = {
    name: 'rows',
    validate: AXIS.validate,
}

export const LAYOUT_PROP_FILTERS = {
    name: 'filters',
    validate: AXIS.validate,
}

export const LAYOUT_PROPS = [
    LAYOUT_PROP_COLUMNS,
    LAYOUT_PROP_ROWS,
    LAYOUT_PROP_FILTERS,
]
