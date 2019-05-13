import isObject from 'lodash-es/isObject'
import isString from 'lodash-es/isString'

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

// Test resources

export const TEST_ITEM_1 = {
    [ITEM_PROP_ID.name]: 'item1Id',
}

export const TEST_ITEM_2 = {
    [ITEM_PROP_ID.name]: 'item2Id',
}

export const TEST_ITEM_3 = {
    [ITEM_PROP_ID.name]: 'item3Id',
}
