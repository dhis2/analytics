import { DEFAULT_AXIS_NAMES } from './axis'
import { axisHasDimension } from './axisHasDimension'
import { dimensionIs } from './dimensionIs'

export const layoutReplaceDimension = (layout, dimensionId, items) => {
    const axisName = DEFAULT_AXIS_NAMES.find(a =>
        axisHasDimension(layout[a], dimensionId)
    )

    if (!axisName) {
        return Object.assign({}, layout)
    }

    const newAxisDimensions = layout[axisName].map(dimension => {
        if (dimensionIs(dimension, dimensionId)) {
            return Object.assign({}, dimension, { items })
        }
        return dimension
    })

    return Object.assign({}, layout, { [axisName]: newAxisDimensions })
}
