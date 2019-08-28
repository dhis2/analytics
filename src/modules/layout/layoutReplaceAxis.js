import { axisNameIsValid } from './axisNameIsValid'

export const layoutReplaceAxis = (layout, axisName, axis) => {
    if (!axisNameIsValid(axisName)) {
        return Object.assign({}, layout)
    }

    return Object.assign({}, layout, { [axisName]: axis })
}
