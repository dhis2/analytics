import arraySort from 'd2-utilizr/lib/arraySort'
import isObject from 'd2-utilizr/lib/isObject'
import objectClean from 'd2-utilizr/lib/objectClean'

const DEFAULT_MAX_VALUE = 100

function getStopsByLegendSet(legendSet) {
    return isObject(legendSet)
        ? arraySort(legendSet.legends, 'ASC', 'endValue').map(legend => [
              parseFloat(legend.endValue) / DEFAULT_MAX_VALUE,
              legend.color,
          ])
        : undefined
}

export default function(series, legendSet) {
    return objectClean({
        min: 0,
        max: DEFAULT_MAX_VALUE,
        lineWidth: 0,
        minorTickInterval: null,
        tickLength: 0,
        tickAmount: 0,
        labels: {
            y: 18,
            style: {
                fontSize: '13px',
            },
        },
        title: {
            text: series[0].name,
        },
        stops: getStopsByLegendSet(legendSet),
    })
}
