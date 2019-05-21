import { isObject } from 'lodash'
import { AXIS } from './axis'

export const LAYOUT = {
    validate: layout => isObject(layout),
}
