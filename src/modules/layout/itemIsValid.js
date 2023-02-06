import { ITEM, ITEM_PROPS } from './item.js'

export const itemIsValid = (item) => {
    if (!ITEM.isValid(item)) {
        return false
    }

    const requiredProps = ITEM_PROPS.filter((prop) => prop.required)

    return requiredProps.every((prop) => prop.isValid(item[prop.name]))
}
