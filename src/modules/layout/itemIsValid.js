import { ITEM, ITEM_PROPS } from './item'

export const itemIsValid = item => {
    if (!ITEM.validate(item)) {
        return false
    }

    const requiredProps = ITEM_PROPS.filter(prop => prop.required)

    return requiredProps.every(prop => prop.validate(item[prop.name]))
}
