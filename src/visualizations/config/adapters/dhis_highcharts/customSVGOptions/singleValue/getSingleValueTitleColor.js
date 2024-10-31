import { colors } from '@dhis2/ui'
import { LEGEND_DISPLAY_STYLE_FILL } from '../../../../../../modules/legends.js'
import { shouldUseContrastColor } from '../../../../../util/shouldUseContrastColor.js'
import { getSingleValueLegendColor } from './getSingleValueLegendColor.js'

export function getSingleValueTitleColor(
    customColor,
    defaultColor,
    value,
    legendOptions,
    legendSets
) {
    // Never override custom color
    if (customColor) {
        return customColor
    }

    const isUsingLegendBackground =
        legendOptions?.style === LEGEND_DISPLAY_STYLE_FILL

    // If not using legend background, always return default color
    if (!isUsingLegendBackground) {
        return defaultColor
    }

    const legendColor = getSingleValueLegendColor(
        legendOptions,
        legendSets,
        value
    )

    // Return default color or contrasting color when using legend background and default color
    return shouldUseContrastColor(legendColor) ? colors.white : defaultColor
}
