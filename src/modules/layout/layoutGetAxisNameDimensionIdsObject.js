import { AXIS, AXIS_NAMES } from './axis'
import { axisGetDimensionIds } from './axisGetDimensionIds'

export const layoutGetAxisNameDimensionIdsObject = layout =>
    AXIS_NAMES.reduce((obj, axisName) => {
        if (AXIS.validate(layout[axisName])) {
            obj[axisName] = axisGetDimensionIds(layout[axisName])
        }

        return obj
    }, {})
