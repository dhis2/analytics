import { isNumeric } from '../../../../modules/utils.js'

export default function (axis) {
    const steps = axis.steps
    return isNumeric(steps) ? steps : undefined
}
