import { colors } from '@dhis2/ui'
import { LEGEND_DISPLAY_STYLE_TEXT } from '../../../../../../modules/legends.js'
import { shouldUseContrastColor } from '../../../../../util/shouldUseContrastColor.js'
import { getSingleValueLegendColor } from './getSingleValueLegendColor.js'

export function getSingleValueTextColor(
    baseColor,
    value,
    legendOptions,
    legendSets
) {
    const legendColor = getSingleValueLegendColor(
        legendOptions,
        legendSets,
        value
    )

    if (!legendColor) {
        return baseColor
    }

    if (legendOptions.style === LEGEND_DISPLAY_STYLE_TEXT) {
        return legendColor
    }

    return shouldUseContrastColor(legendColor) ? colors.white : baseColor
}
