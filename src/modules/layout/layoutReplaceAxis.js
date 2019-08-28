import { axisIsValid } from './axis'

export const layoutReplaceAxis = (layout, axisName, axis) => {
    if (!axisIsValid(axisName)) {
        return Object.assign({}, layout)
    }

    return Object.assign({}, layout, { [axisName]: axis })
}
