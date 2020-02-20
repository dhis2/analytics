import { isColorBright } from './isColorBright'
import { colors } from '@dhis2/ui-core'
import {
    getColorByValueFromLegendSet,
    LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM,
    LEGEND_DISPLAY_STRATEGY_FIXED,
    LEGEND_DISPLAY_STYLE_TEXT,
    LEGEND_DISPLAY_STYLE_FILL,
} from '../legends'

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

const buildStyleObject = (legendColor, engine) => {
    const style = {}
    switch (engine.visualization.legendDisplayStyle) {
        case LEGEND_DISPLAY_STYLE_TEXT:
            style.color = legendColor
            // TODO: Adapt background color for light text colors
            break
        case LEGEND_DISPLAY_STYLE_FILL:
        default:
            style.backgroundColor = legendColor
            if (isColorBright(legendColor)) {
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

    const legendColor = getColorByValueFromLegendSet(legendSet, value)

    return buildStyleObject(legendColor, engine)
}
