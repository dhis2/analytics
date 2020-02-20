import { isColorBright } from './isColorBright'
import { colors } from '@dhis2/ui-core'

const LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM = 'BY_DATA_ITEM'
const LEGEND_DISPLAY_STRATEGY_FIXED = 'FIXED'

const LEGEND_DISPLAY_STYLE_FILL = 'FILL'
const LEGEND_DISPLAY_STYLE_TEXT = 'TEXT'

const valueFitsLegend = (value, legend) =>
    legend.startValue <= value && legend.endValue > value // TODO: Confirm inclusive/exclusive bounds

const getLegendSet = engine => {
    let legendSetId
    switch (engine.visualization.legendDisplayStrategy) {
        case LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM:
            legendSetId = undefined // TODO: ByDXID LegendSet
            //engine.rawData.metaData.items[dxId].legendSet
            break
        case LEGEND_DISPLAY_STRATEGY_FIXED:
        default:
            legendSetId = engine.visualization.legendSet
                ? engine.visualization.legendSet.id
                : undefined
            break
    }

    return engine.legendSets[legendSetId]
}

const buildStyleObject = (legend, engine) => {
    const style = {}
    switch (engine.visualization.legendDisplayStyle) {
        case LEGEND_DISPLAY_STYLE_TEXT:
            style.color = legend.color
            // TODO: Adapt background color for light text colors
            break
        case LEGEND_DISPLAY_STYLE_FILL:
        default:
            style.backgroundColor = legend.color
            if (isColorBright(legend.color)) {
                style.color = colors.grey900
            } else {
                style.color = colors.white
            }
            break
    }
    return style
}

export const applyLegendSet = (value, engine) => {
    if (isNaN(value) || !engine.legendSets) {
        return {}
    }

    const legendSet = getLegendSet(engine)
    if (!legendSet) {
        return {}
    }

    const legend = legendSet.legends.find(legend =>
        valueFitsLegend(value, legend)
    )
    if (!legend) {
        return {}
    }

    return buildStyleObject(legend, engine)
}
