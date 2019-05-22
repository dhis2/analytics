import isObject from 'lodash/isObject'
import isString from 'lodash/isString'

// Item

export const ITEM = {
    validate: item => isObject(item),
}

// Props

export const ITEM_PROP_ID = {
    name: 'id',
    defaultValue: '',
    required: true,
    validate: prop => isString(prop),
}

export const ITEM_PROPS = [ITEM_PROP_ID]
