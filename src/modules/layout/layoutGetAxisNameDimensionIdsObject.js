import { AXIS, DEFAULT_AXIS_NAMES } from './axis'
import { axisGetDimensionIds } from './axisGetDimensionIds'

export const layoutGetAxisNameDimensionIdsObject = layout =>
    DEFAULT_AXIS_NAMES.reduce((obj, axisName) => {
        if (AXIS.isValid(layout[axisName])) {
            obj[axisName] = axisGetDimensionIds(layout[axisName])
        }

        return obj
    }, {})
