import isNumeric from 'd2-utilizr/lib/isNumeric'

export default function (axes = [], axisType, axisIndex) {
    const steps = axes.find(
        axis => axis.type === axisType && axis.index === axisIndex
    )?.steps
    return isNumeric(steps) ? steps : undefined
}
