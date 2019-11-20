import { AXIS, DEFAULT_AXIS_IDS } from './axis'
import { dimensionGetId } from './dimensionGetId'

export const layoutFilterDimensions = (layout, dimensionIds) => {
    const idArray = Array.isArray(dimensionIds) ? dimensionIds : [dimensionIds]
    const filteredLayout = Object.assign({}, layout)

    DEFAULT_AXIS_IDS.forEach(axisId => {
        if (AXIS.isValid(filteredLayout[axisId])) {
            filteredLayout[axisId] = filteredLayout[axisId].filter(
                dimension => !idArray.includes(dimensionGetId(dimension))
            )
        }
    })

    return filteredLayout
}
