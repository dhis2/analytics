export const LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM = 'BY_DATA_ITEM'
export const LEGEND_DISPLAY_STRATEGY_FIXED = 'FIXED'

export const LEGEND_DISPLAY_STYLE_FILL = 'FILL'
export const LEGEND_DISPLAY_STYLE_TEXT = 'TEXT'

export const getLegendSetById = (legendSets, id) => {
    if (!legendSets || !id) {
        return {}
    }
    return legendSets.find(legendSet => legendSet.id === id)
}

export const getColorByValueFromLegendSet = (legendSet, value) => {
    const legend = legendSet.legends.find(
        legend => value >= legend.startValue && value < legend.endValue // TODO: Confirm inclusive/exclusive bounds
    )
    return legend ? legend.color : undefined
}
