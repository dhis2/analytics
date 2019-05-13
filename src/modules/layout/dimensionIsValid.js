import { DIMENSION, DIMENSION_PROPS } from './dimension'

export const dimensionIsValid = dimension => {
    if (!DIMENSION.validate(dimension)) {
        return false
    }

    const requiredProps = DIMENSION_PROPS.filter(prop => prop.required)

    return requiredProps.every(prop => prop.validate(dimension[prop.name]))
}
