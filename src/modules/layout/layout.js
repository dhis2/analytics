import isObject from 'lodash/isObject'

export const LAYOUT = {
    validate: layout => isObject(layout),
}
