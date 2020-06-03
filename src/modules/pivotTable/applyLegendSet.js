import { isColorBright } from './isColorBright'
import { colors } from '@dhis2/ui-constants'
import {
    getColorByValueFromLegendSet,
    LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM,
    LEGEND_DISPLAY_STRATEGY_FIXED,
    LEGEND_DISPLAY_STYLE_TEXT,
    LEGEND_DISPLAY_STYLE_FILL,
} from '../legends'

const getLegendSet = (engine, dxDimension) => {
    let legendSetId
    switch (engine.visualization.legendDisplayStrategy) {
        case LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM:
            if (dxDimension && dxDimension.legendSet) {
                legendSetId = dxDimension.legendSet
            }
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

export const applyLegendSet = (value, dxDimension, engine) => {
    if (isNaN(value) || !engine.legendSets) {
        return {}
    }

    const legendSet = getLegendSet(engine, dxDimension)
    if (!legendSet) {
        return {}
    }

    const legendColor = getColorByValueFromLegendSet(legendSet, value)
    if (!legendColor) {
        return {}
    }

    return buildStyleObject(legendColor, engine)
}
