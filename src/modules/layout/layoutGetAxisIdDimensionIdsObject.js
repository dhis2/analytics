import { AXIS, DEFAULT_AXIS_IDS } from './axis'
import { axisGetDimensionIds } from './axisGetDimensionIds'

export const layoutGetAxisIdDimensionIdsObject = (layout) =>
    DEFAULT_AXIS_IDS.reduce((obj, axisId) => {
        if (AXIS.isValid(layout[axisId])) {
            obj[axisId] = axisGetDimensionIds(layout[axisId])
        }

        return obj
    }, {})
