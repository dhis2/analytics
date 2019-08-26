import { axisIsValid } from './axis'

export const layoutReplaceAxis = (layout, axisName, axisDimensions) => {
    if (!axisIsValid(axisName)) {
        return Object.assign({}, layout)
    }

    return Object.assign({}, layout, { [axisName]: axisDimensions })
}
