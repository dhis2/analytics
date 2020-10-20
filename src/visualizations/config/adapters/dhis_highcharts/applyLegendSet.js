import isNumeric from 'd2-utilizr/lib/isNumeric'

import { getLegendByValueFromLegendSet } from "../../../../modules/legends"

const getLegend = (value, legendSet) =>
    value && legendSet
        ? getLegendByValueFromLegendSet(legendSet, value)
        : {}

export default (seriesObj, legendSet) =>
    !seriesObj.type
        ? {
                ...seriesObj,
                data: seriesObj.data.map(value =>
                    isNumeric(value) // Single category pass data as [value1, value2]
                        ? {
                            y: value,
                            color: getLegend(value, legendSet)?.color,
                            legend: getLegend(value, legendSet)?.name,
                            legendSet: legendSet.name,
                        }
                        : Array.isArray(value) // Dual category pass data as [[position1, value1], [position2, value2]]
                        ? {
                            x: value[0],
                            y: value[1],
                            color: getLegend(value[1], legendSet)?.color,
                            legend: getLegend(value[1], legendSet)?.name,
                            legendSet: legendSet.name,
                        }
                        : value
                ),
            }
        : { ...seriesObj }

