import i18n from '@dhis2/d2-i18n'

import arrayClean from 'd2-utilizr/lib/arrayClean'
import objectClean from 'd2-utilizr/lib/objectClean'
import isNumeric from 'd2-utilizr/lib/isNumeric'
import isString from 'd2-utilizr/lib/isString'
import getAxisTitle from '../getAxisTitle'
import getGauge from './gauge'
import { isStacked, VIS_TYPE_GAUGE, isDualAxisType } from '../../../../../modules/visTypes'
import { hasCustomAxes, getAxisIdsMap } from '../customAxes'
import { getAxisStringFromId } from '../../../../util/axisId'
import { FONT_STYLE_VERTICAL_AXIS_TITLE } from '../../../../../modules/fontStyle'

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

function getMultipleAxes(theme, axes) {
    const axisObjects = []
    axes.map(axisId => {
        const id = Number(axisId)
        axisObjects.push({
            title: {
                text: i18n.t('Axis {{axisId}}', {
                    axisId: id + 1,
                }),
                style: {
                    color: theme[id].mainColor,
                    'font-weight': 700,
                },
            },
            id: getAxisStringFromId(id),
            opposite: !!(id % 2),
        })
    })
    return axisObjects
}

function getDefault(layout, series, extraOptions) {
    const fontStyle = layout.fontStyle && layout.fontStyle[FONT_STYLE_VERTICAL_AXIS_TITLE]
    const axes = []
    const filteredSeries = layout.series.filter(layoutSeriesItem => series.some(seriesItem => seriesItem.id === layoutSeriesItem.dimensionItem))
    if (isDualAxisType(layout.type) && hasCustomAxes(filteredSeries)) {
        const axisIdsMap = getAxisIdsMap(layout.series, series)
        axes.push(...getMultipleAxes(extraOptions.multiAxisTheme, [...new Set(Object.keys(axisIdsMap))].sort((a, b) => a - b)))
    } else {
        axes.push(
            objectClean({
                min: getMinValue(layout),
                max: getMaxValue(layout),
                tickAmount: getSteps(layout),
                title: getAxisTitle(layout.rangeAxisLabel, fontStyle),
                plotLines: arrayClean([
                    getTargetLine(layout),
                    getBaseLine(layout),
                ]),
                gridLineColor: DEFAULT_GRIDLINE_COLOR,
                labels: getLabels(layout),
                id: getAxisStringFromId(0),

                // DHIS2-649: put first serie at the bottom of the stack
                // in this way the legend sequence matches the serie sequence
                reversedStacks: isStacked(layout.type) ? false : true,
            })
        )
    }

    return axes
}

export default function(layout, series, extraOptions) {
    let yAxis
    switch (layout.type) {
        case VIS_TYPE_GAUGE:
            yAxis = getGauge(layout, series, extraOptions.legendSets[0])
            break
        default:
            yAxis = getDefault(layout, series, extraOptions)
    }

    return yAxis
}
