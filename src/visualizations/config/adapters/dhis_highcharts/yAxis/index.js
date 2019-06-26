import arrayClean from 'd2-utilizr/lib/arrayClean'
import objectClean from 'd2-utilizr/lib/objectClean'
import isNumeric from 'd2-utilizr/lib/isNumeric'
import isString from 'd2-utilizr/lib/isString'
import getAxisTitle from '../getAxisTitle'
import { CHART_TYPE_GAUGE } from '../type'
import getGauge from './gauge'
import { getIsStacked } from '../type'
import { shouldHaveDualAxis } from '../layout'

const DEFAULT_MIN_VALUE = 0

const DEFAULT_GRIDLINE_COLOR = '#E1E1E1'

const DEFAULT_PLOTLINE = {
    color: '#000',
    width: 2,
    zIndex: 4,
}

const DEFAULT_PLOTLINE_LABEL = {
    y: -7,
    style: {
        fontSize: 13,
        textShadow: '0 0 6px #FFF',
    },
}

function getMinValue(layout) {
    return isNumeric(layout.rangeAxisMinValue)
        ? layout.rangeAxisMinValue
        : DEFAULT_MIN_VALUE
}

function getMaxValue(layout) {
    return isNumeric(layout.rangeAxisMaxValue)
        ? layout.rangeAxisMaxValue
        : undefined
}

function getSteps(layout) {
    return isNumeric(layout.rangeAxisSteps) ? layout.rangeAxisSteps : undefined
}

function getTargetLine(layout) {
    return isNumeric(layout.targetLineValue)
        ? Object.assign(
              {},
              DEFAULT_PLOTLINE,
              objectClean({
                  value: layout.targetLineValue,
                  label: isString(layout.targetLineLabel)
                      ? Object.assign({}, DEFAULT_PLOTLINE_LABEL, {
                            text: layout.targetLineLabel,
                        })
                      : undefined,
              })
          )
        : undefined
}

function getBaseLine(layout) {
    return isNumeric(layout.baseLineValue)
        ? Object.assign(
              {},
              DEFAULT_PLOTLINE,
              objectClean({
                  value: layout.baseLineValue,
                  label: isString(layout.baseLineLabel)
                      ? Object.assign({}, DEFAULT_PLOTLINE_LABEL, {
                            text: layout.baseLineLabel,
                        })
                      : undefined,
              })
          )
        : undefined
}

function getFormatter(layout) {
    return {
        formatter: function() {
            return this.value.toFixed(layout.rangeAxisDecimals)
        },
    }
}

function getLabels(layout) {
    return isNumeric(layout.rangeAxisDecimals)
        ? getFormatter(layout)
        : undefined
}

function getDualAxes(theme) {
    return [
        {
            title: {
                text: 'Axis 1',
                style: {
                    color: theme[0].mainColor,
                    'font-weight': 700,
                },
            },
        },
        {
            title: {
                text: 'Axis 2',
                style: {
                    color: theme[1].mainColor,
                    'font-weight': 700,
                },
            },
            opposite: true,
        },
    ]
}

function getDefault(layout, extraOptions) {
    const axes = []

    if (shouldHaveDualAxis(layout)) {
        const dualAxes = getDualAxes(extraOptions.multiAxisTheme)
        axes.push(dualAxes[0], dualAxes[1])
    } else {
        axes.push(
            objectClean({
                min: getMinValue(layout),
                max: getMaxValue(layout),
                tickAmount: getSteps(layout),
                title: getAxisTitle(layout.rangeAxisLabel),
                plotLines: arrayClean([
                    getTargetLine(layout),
                    getBaseLine(layout),
                ]),
                gridLineColor: DEFAULT_GRIDLINE_COLOR,
                labels: getLabels(layout),

                // DHIS2-649: put first serie at the bottom of the stack
                // in this way the legend sequence matches the serie sequence
                reversedStacks: getIsStacked(layout.type) ? false : true,
            })
        )
    }

    return axes
}

export default function(layout, series, extraOptions) {
    let yAxis

    switch (layout.type) {
        case CHART_TYPE_GAUGE:
            yAxis = getGauge(series, extraOptions.legendSet)
            break
        default:
            yAxis = getDefault(layout, extraOptions)
    }

    return yAxis
}
