export const getColorByValueFromLegendSet = (legendSet, value) => {
    const legend = legendSet.legends.find(
        legend => value >= legend.startValue && value < legend.endValue // TODO: Confirm inclusive/exclusive bounds
    )
    return legend ? legend.color : undefined
}
