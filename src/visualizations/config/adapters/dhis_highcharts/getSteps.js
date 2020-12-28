import isNumeric from 'd2-utilizr/lib/isNumeric'

import { getAxis } from '../../../util/axes'

export default function (axes = [], axisType, axisIndex) {
    const steps = getAxis(axes, axisType, axisIndex).steps
    return isNumeric(steps) ? steps : undefined
}
