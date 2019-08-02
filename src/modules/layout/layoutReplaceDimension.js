import { AXIS_NAMES } from './axis'
import { axisHasDimension } from './axisHasDimension'

export const layoutReplaceDimension = (layout, dimensionName, items) => {
    const axisName = AXIS_NAMES.find(a =>
        axisHasDimension(layout[a], dimensionName)
    )

    const newAxisDimensions = layout[axisName].map(dimension => {
        if (dimension.dimension === dimensionName) {
            return Object.assign({}, dimension, { items })
        }
        return dimension
    })

    return Object.assign({}, layout, { [axisName]: newAxisDimensions })
}
