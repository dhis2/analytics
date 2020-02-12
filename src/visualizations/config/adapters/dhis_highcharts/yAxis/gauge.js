import arrayClean from 'd2-utilizr/lib/arrayClean'
import arraySort from 'd2-utilizr/lib/arraySort'
import isNumber from 'd2-utilizr/lib/isNumber'
import isObject from 'd2-utilizr/lib/isObject'
import objectClean from 'd2-utilizr/lib/objectClean'
import i18n from '@dhis2/d2-i18n'

const DEFAULT_MAX_VALUE = 100

const DEFAULT_PLOT_LINE_STYLE = {
    zIndex: 5,
    width: 1,
    color: '#000',
}

const DEFAULT_TARGET_LINE_LABEL = i18n.t('Target')
const DEFAULT_BASE_LINE_LABEL = i18n.t('Base')

function getStopsByLegendSet(legendSet) {
    return isObject(legendSet)
        ? arraySort(legendSet.legends, 'ASC', 'endValue').map(legend => [
              parseFloat(legend.endValue) / DEFAULT_MAX_VALUE,
              legend.color,
          ])
        : undefined
}

function getPlotLine(value, label) {
    return {
        value,
        ...DEFAULT_PLOT_LINE_STYLE,
        ...(label && {
            label: {
                text: `${label}: ${value}`,
            }
        })
    }
}

export default function(layout, series, legendSet) {
    const plotLines = arrayClean([
        isNumber(layout.baseLineValue) ? getPlotLine(layout.baseLineValue, layout.baseLineLabel || DEFAULT_BASE_LINE_LABEL) : null,
        isNumber(layout.targetLineValue) ? getPlotLine(layout.targetLineValue, layout.targetLineLabel || DEFAULT_TARGET_LINE_LABEL) : null
    ])
    return objectClean({
        min: isNumber(layout.rangeAxisMinValue) ? layout.rangeAxisMinValue : 0,
        max: isNumber(layout.rangeAxisMaxValue) ? layout.rangeAxisMaxValue : DEFAULT_MAX_VALUE,
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
        ...(plotLines.length && {
            plotLines
        })
    })
}
