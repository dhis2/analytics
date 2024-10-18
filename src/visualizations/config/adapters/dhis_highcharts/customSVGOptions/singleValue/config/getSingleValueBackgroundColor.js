import { LEGEND_DISPLAY_STYLE_FILL } from '../../../../../../../modules/legends.js'
import { getSingleValueLegendColor } from './getSingleValueLegendColor.js'

export function getSingleValueBackgroundColor(
    legendOptions,
    legendSets,
    value
) {
    const legendColor = getSingleValueLegendColor(
        legendOptions,
        legendSets,
        value
    )
    return legendColor && legendOptions.style === LEGEND_DISPLAY_STYLE_FILL
        ? legendColor
        : 'transparent'
}
