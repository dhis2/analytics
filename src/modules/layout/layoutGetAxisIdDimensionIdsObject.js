import { AXIS, DEFAULT_AXIS_IDS } from './axis.js'
import { axisGetDimensionIds } from './axisGetDimensionIds.js'

export const layoutGetAxisIdDimensionIdsObject = layout =>
    DEFAULT_AXIS_IDS.reduce((obj, axisId) => {
        if (AXIS.isValid(layout[axisId])) {
            obj[axisId] = axisGetDimensionIds(layout[axisId])
        }

        return obj
    }, {})
