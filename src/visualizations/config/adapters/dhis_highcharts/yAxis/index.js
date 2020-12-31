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
    FONT_STYLE_AXIS_LABELS,
    FONT_STYLE_REGRESSION_LINE_LABEL,
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_BOLD,
    FONT_STYLE_OPTION_ITALIC,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    TEXT_ALIGN_LEFT,
    TEXT_ALIGN_CENTER,
    TEXT_ALIGN_RIGHT,
    mergeFontStyleWithDefault,
} from '../../../../../modules/fontStyle'
import { getTextAlignOption } from '../getTextAlignOption'
import { axisHasRelativeItems } from '../../../../../modules/layout/axisHasRelativeItems'
import getSteps from '../getSteps'
import getFormatter from '../getFormatter'
import { getAxis } from '../../../../util/axes'

const DEFAULT_MIN_VALUE = 0
const DEFAULT_GRIDLINE_COLOR = '#E1E1E1'
const AXIS_TYPE = 'RANGE'
const AXIS_INDEX = 0

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

const getMinValue = (minValue, dataValues) =>
    isNumeric(minValue)
        ? minValue
        : dataValues?.some(value => value < DEFAULT_MIN_VALUE)
        ? undefined
        : DEFAULT_MIN_VALUE

const getMaxValue = (maxValue, dataValues) =>
    isNumeric(maxValue)
        ? maxValue
        : dataValues?.every(value => value < DEFAULT_MIN_VALUE)
        ? DEFAULT_MIN_VALUE
        : undefined

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

    const result = { [alignKey]: alignValue, [offsetKey]: offsetValue }
    if (isVertical) {
        result.align = getTextAlignOption(fontStyle, fontStyleType)
    }
    return result
}

function getRegressionLine(regressionLine = {}, visType) {
    const fontStyle = mergeFontStyleWithDefault(
        regressionLine.title?.fontStyle,
        FONT_STYLE_REGRESSION_LINE_LABEL
    )

    const plotLineStyle = getPlotLineStyle(fontStyle)
    const plotLineLabelStyle = getPlotLineLabelStyle(fontStyle)

    return isNumeric(regressionLine.value)
        ? Object.assign(
              {},
              plotLineStyle,
              objectClean({
                  value: regressionLine.value,
                  label: isString(regressionLine.title?.text)
                      ? Object.assign({}, plotLineLabelStyle, {
                            text: regressionLine.title.text,
                            ...getLineLabelStyle(
                                fontStyle[FONT_STYLE_OPTION_TEXT_ALIGN],
                                FONT_STYLE_REGRESSION_LINE_LABEL,
                                visType
                            ),
                        })
                      : undefined,
              })
          )
        : undefined
}

function getLabels(axis) {
    const fontStyle = mergeFontStyleWithDefault(
        axis.label?.fontStyle,
        FONT_STYLE_AXIS_LABELS
    )
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
        ...getFormatter(axis),
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
    const dataValues = series?.map(item => item.data).flat()
    if (
        isDualAxisType(layout.type) &&
        hasCustomAxes(filteredSeries) &&
        !axisHasRelativeItems(layout.columns)
    ) {
        const axisIdsMap = getAxisIdsMap(layout.series, series)
        axes.push(
            ...getMultipleAxes(
                extraOptions.multiAxisTheme,
                [...new Set(Object.keys(axisIdsMap))].sort((a, b) => a - b)
            )
        )
    } else {
        const axis = getAxis(layout.axes, AXIS_TYPE, AXIS_INDEX)
        axes.push(
            objectClean({
                min: getMinValue(axis.minValue, dataValues),
                max: getMaxValue(axis.maxValue, dataValues),
                tickAmount: getSteps(axis),
                title: getAxisTitle(
                    axis.title?.text,
                    mergeFontStyleWithDefault(
                        axis.title?.fontStyle,
                        FONT_STYLE_VERTICAL_AXIS_TITLE
                    ),
                    FONT_STYLE_VERTICAL_AXIS_TITLE,
                    layout.type
                ),
                plotLines: arrayClean([
                    getRegressionLine(axis.targetLine, layout.type),
                    getRegressionLine(axis.baseLine, layout.type),
                ]),
                gridLineColor: DEFAULT_GRIDLINE_COLOR,
                labels: getLabels(axis),
                id: getAxisStringFromId(0),

                // DHIS2-649: put first serie at the bottom of the stack
                // in this way the legend sequence matches the serie sequence
                reversedStacks: isStacked(layout.type) ? false : true,
            })
        )
    }

    return axes
}

export default function (layout, series, extraOptions) {
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
