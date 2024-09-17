import { getColorByValueFromLegendSet } from '../../../../../../../modules/legends.js'

export function getSingleValueLegendColor(legendOptions, legendSets, value) {
    const legendSet = legendOptions && legendSets[0]
    return legendSet
        ? getColorByValueFromLegendSet(legendSet, value)
        : undefined
}
