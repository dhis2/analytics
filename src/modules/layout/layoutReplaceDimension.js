import { DEFAULT_AXIS_IDS } from './axis'
import { axisHasDimension } from './axisHasDimension'
import { dimensionIs } from './dimensionIs'

export const layoutReplaceDimension = (layout, dimensionId, items) => {
    const axisId = DEFAULT_AXIS_IDS.find(a =>
        axisHasDimension(layout[a], dimensionId)
    )

    if (!axisId) {
        return Object.assign({}, layout)
    }

    const newAxisDimensions = layout[axisId].map(dimension => {
        if (dimensionIs(dimension, dimensionId)) {
            return Object.assign({}, dimension, { items })
        }
        return dimension
    })

    return Object.assign({}, layout, { [axisId]: newAxisDimensions })
}
