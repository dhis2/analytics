import i18n from '@dhis2/d2-i18n'

import arrayClean from 'd2-utilizr/lib/arrayClean'
import objectClean from 'd2-utilizr/lib/objectClean'
import isNumeric from 'd2-utilizr/lib/isNumeric'
import isString from 'd2-utilizr/lib/isString'
import getAxisTitle from '../getAxisTitle'
import getGauge from './gauge'
import {
    isStacked,
    VIS_TYPE_GAUGE,
    isDualAxisType,
    isVerticalType,
} from '../../../../../modules/visTypes'
import { hasCustomAxes } from '../../../../../modules/axis'
import { getAxisIdsMap } from '../customAxes'
import { getAxisStringFromId } from '../../../../util/axisId'
import {
    FONT_STYLE_VERTICAL_AXIS_TITLE,
    FONT_STYLE_SERIES_AXIS_LABELS,
    FONT_STYLE_TARGET_LINE_LABEL,
    FONT_STYLE_BASE_LINE_LABEL,
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_BOLD,
    FONT_STYLE_OPTION_ITALIC,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    TEXT_ALIGN_LEFT,
    TEXT_ALIGN_CENTER,
    TEXT_ALIGN_RIGHT,
} from '../../../../../modules/fontStyle'
import { getTextAlignOption } from '../getTextAlignOption'

const DEFAULT_MIN_VALUE = 0

const DEFAULT_GRIDLINE_COLOR = '#E1E1E1'

function getPlotLineStyle(fontStyle) {
    return {
        color: fontStyle[FONT_STYLE_OPTION_TEXT_COLOR] || '#000',
        width: 2,
        zIndex: 4,
    }
}

function getPlotLineLabelStyle(fontStyle) {
    return {
        y: -7,
        style: {
            color: fontStyle[FONT_STYLE_OPTION_TEXT_COLOR],
            fontSize: `${fontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`,
            fontWeight: fontStyle[FONT_STYLE_OPTION_BOLD]
                ? FONT_STYLE_OPTION_BOLD
                : 'normal',
            fontStyle: fontStyle[FONT_STYLE_OPTION_ITALIC]
                ? FONT_STYLE_OPTION_ITALIC
                : 'normal',
        },
    }
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

const getLabelOffsetFromTextAlign = textAlign => {
    switch (textAlign) {
        case TEXT_ALIGN_LEFT:
            return 10
        case TEXT_ALIGN_RIGHT:
            return -10
        case TEXT_ALIGN_CENTER:
        default:
            return 0
    }
}

const getLineLabelStyle = (fontStyle, fontStyleType, visType) => {
    const isVertical = isVerticalType(visType)
    const alignKey = isVertical ? 'verticalAlign' : 'align'
    const alignValue = getTextAlignOption(fontStyle, fontStyleType, visType)
    const offsetKey = isVertical ? 'y' : 'x'
    const offsetValue = getLabelOffsetFromTextAlign(fontStyle)
    
    const result = {[alignKey]: alignValue, [offsetKey]: offsetValue }
    if (isVertical) {
        result.align = getTextAlignOption(fontStyle, fontStyleType)
    }
    return result
}

function getTargetLine(layout) {
    const fontStyle = layout.fontStyle[FONT_STYLE_TARGET_LINE_LABEL]

    const plotLineStyle = getPlotLineStyle(fontStyle)
    const plotLineLabelStyle = getPlotLineLabelStyle(fontStyle)

    return isNumeric(layout.targetLineValue)
        ? Object.assign(
              {},
              plotLineStyle,
              objectClean({
                  value: layout.targetLineValue,
                  label: isString(layout.targetLineLabel)
                      ? Object.assign({}, plotLineLabelStyle, {
                            text: layout.targetLineLabel,
                            ...getLineLabelStyle(fontStyle[FONT_STYLE_OPTION_TEXT_ALIGN], FONT_STYLE_BASE_LINE_LABEL, layout.type),
                        })
                      : undefined,
              })
          )
        : undefined
}

function getBaseLine(layout) {
    const fontStyle = layout.fontStyle[FONT_STYLE_BASE_LINE_LABEL]

    const plotLineStyle = getPlotLineStyle(fontStyle)
    const plotLineLabelStyle = getPlotLineLabelStyle(fontStyle)

    return isNumeric(layout.baseLineValue)
        ? Object.assign(
              {},
              plotLineStyle,
              objectClean({
                  value: layout.baseLineValue,
                  label: isString(layout.baseLineLabel)
                      ? Object.assign({}, plotLineLabelStyle, {
                            text: layout.baseLineLabel,
                            ...getLineLabelStyle(fontStyle[FONT_STYLE_OPTION_TEXT_ALIGN], FONT_STYLE_BASE_LINE_LABEL, layout.type),
                        })
                      : undefined,
              })
          )
        : undefined
}

function getFormatter(layout) {
    return isNumeric(layout.rangeAxisDecimals)
        ? {
              formatter: function() {
                  return this.value.toFixed(layout.rangeAxisDecimals)
              },
          }
        : {}
}

function getLabels(layout) {
    const fontStyle = layout.fontStyle[FONT_STYLE_SERIES_AXIS_LABELS]
    return {
        style: {
            color: fontStyle[FONT_STYLE_OPTION_TEXT_COLOR],
            fontSize: `${fontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`,
            fontWeight: fontStyle[FONT_STYLE_OPTION_BOLD]
                ? FONT_STYLE_OPTION_BOLD
                : 'normal',
            fontStyle: fontStyle[FONT_STYLE_OPTION_ITALIC]
                ? FONT_STYLE_OPTION_ITALIC
                : 'normal',
        },
        ...getFormatter(layout),
    }
}

function getMultipleAxes(theme, axes) {
    const axisObjects = []
    axes.forEach(axisId => {
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
    const axes = []
    const filteredSeries = layout.series?.filter(layoutSeriesItem =>
        series.some(
            seriesItem => seriesItem.id === layoutSeriesItem.dimensionItem
        )
    )
    if (isDualAxisType(layout.type) && hasCustomAxes(filteredSeries)) {
        const axisIdsMap = getAxisIdsMap(layout.series, series)
        axes.push(
            ...getMultipleAxes(
                extraOptions.multiAxisTheme,
                [...new Set(Object.keys(axisIdsMap))].sort((a, b) => a - b)
            )
        )
    } else {
        axes.push(
            objectClean({
                min: getMinValue(layout),
                max: getMaxValue(layout),
                tickAmount: getSteps(layout),
                title: getAxisTitle(layout.rangeAxisLabel, layout.fontStyle[FONT_STYLE_VERTICAL_AXIS_TITLE], FONT_STYLE_VERTICAL_AXIS_TITLE, layout.type
                ),
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
