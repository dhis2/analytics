import isNumeric from 'd2-utilizr/lib/isNumeric'

export default function (axis) {
    const steps = axis.steps
    return isNumeric(steps) ? steps : undefined
}
