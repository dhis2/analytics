import { getColorByValueFromLegendSet } from "../../../../modules/legends"

export default (series, legendSet) =>
    series.map(seriesObj => ({
        ...seriesObj,
        data: seriesObj.map(value => ({
            y: value,
            color: getColorByValueFromLegendSet(legendSet, value),
        })),
    }))
