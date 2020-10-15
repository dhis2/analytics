import isNumeric from 'd2-utilizr/lib/isNumeric'

import { getColorByValueFromLegendSet } from "../../../../modules/legends"

export default (series, legendSet) =>
    series.map(seriesObj => ({
        ...seriesObj,
        data: seriesObj.data.map(value => (isNumeric(value) ? {
            y: value,
            color: getColorByValueFromLegendSet(legendSet, value),
        } : value)),
    }))
