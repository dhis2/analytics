import { isObject } from 'lodash'

export const LAYOUT = {
    validate: layout => isObject(layout),
}
