import isString from 'lodash-es/isString'

// Props

export const ITEM_PROP_ID = {
    name: 'id',
    defaultValue: '',
    required: true,
    validate: prop => isString(prop),
}
