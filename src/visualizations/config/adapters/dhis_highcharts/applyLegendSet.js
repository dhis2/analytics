import isNumeric from 'd2-utilizr/lib/isNumeric'

import { getColorByValueFromLegendSet } from "../../../../modules/legends"

const getColor = (value, legendSet) =>
    value && legendSet
        ? getColorByValueFromLegendSet(legendSet, value)
        : undefined

export default (series, legendSet) =>
    series.map(seriesObj =>
        !seriesObj.type
            ? {
                  ...seriesObj,
                  data: seriesObj.data.map(value =>
                      isNumeric(value) // Single category pass data as [value1, value2]
                          ? {
                                y: value,
                                color: getColor(value, legendSet),
                            }
                          : Array.isArray(value) // Dual category pass data as [[position1, value1], [position2, value2]]
                          ? {
                                x: value[0],
                                y: value[1],
                                color: getColor(value[1], legendSet),
                            }
                          : value
                  ),
              }
            : { ...seriesObj }
    )

