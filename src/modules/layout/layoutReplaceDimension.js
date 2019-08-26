import { AXIS_NAMES } from './axis'
import { axisHasDimension } from './axisHasDimension'

export const layoutReplaceDimension = (layout, dimensionId, items) => {
    const axisName = AXIS_NAMES.find(a =>
        axisHasDimension(layout[a], dimensionId)
    )

    if (!axisName) {
        return Object.assign({}, layout)
    }

    const newAxisDimensions = layout[axisName].map(dimension => {
        if (dimension.dimension === dimensionId) {
            return Object.assign({}, dimension, { items })
        }
        return dimension
    })

    return Object.assign({}, layout, { [axisName]: newAxisDimensions })
}
