import { AXIS, DEFAULT_AXIS_IDS } from './axis.js'
import { dimensionGetId } from './dimensionGetId.js'

export const layoutFilterDimensions = (layout, dimensionIds) => {
    const idArray = Array.isArray(dimensionIds) ? dimensionIds : [dimensionIds]
    const filteredLayout = Object.assign({}, layout)

    DEFAULT_AXIS_IDS.forEach((axisId) => {
        if (AXIS.isValid(filteredLayout[axisId])) {
            filteredLayout[axisId] = filteredLayout[axisId].filter(
                (dimension) => !idArray.includes(dimensionGetId(dimension))
            )
        }
    })

    return filteredLayout
}
