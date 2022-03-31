import isObject from 'lodash/isObject'

export const LAYOUT = {
    isValid: (layout) => isObject(layout),
}
