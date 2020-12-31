import arrayClean from 'd2-utilizr/lib/arrayClean'
import objectClean from 'd2-utilizr/lib/objectClean'
import isNumeric from 'd2-utilizr/lib/isNumeric'
import isString from 'd2-utilizr/lib/isString'

import getAxisTitle from '../getAxisTitle'
import { isVerticalType } from '../../../../../modules/visTypes'
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
import getSteps from '../getSteps'
import getFormatter from '../getFormatter'
import { getAxis } from '../../../../util/axes'

const DEFAULT_MIN_VALUE = 0
const DEFAULT_GRIDLINE_COLOR = '#E1E1E1'
const AXIS_TYPE = 'RANGE'
const AXIS_INDEX = 1

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

function getTargetLine() {
    // const fontStyle = layout.fontStyle[FONT_STYLE_TARGET_LINE_LABEL]
    // const plotLineStyle = getPlotLineStyle(fontStyle)
    // const plotLineLabelStyle = getPlotLineLabelStyle(fontStyle)
    // return isNumeric(layout.targetLineValue)
    //     ? Object.assign(
    //           {},
    //           plotLineStyle,
    //           objectClean({
    //               value: layout.targetLineValue,
    //               label: isString(layout.targetLineLabel)
    //                   ? Object.assign({}, plotLineLabelStyle, {
    //                         text: layout.targetLineLabel,
    //                         ...getLineLabelStyle(
    //                             fontStyle[FONT_STYLE_OPTION_TEXT_ALIGN],
    //                             FONT_STYLE_REGRESSION_LINE_LABEL,
    //                             layout.type
    //                         ),
    //                     })
    //                   : undefined,
    //           })
    //       )
    //     : undefined
}

//FIXME: Replace this with getRegressionLine from yAxys
function getBaseLine(layout) {
    const fontStyle = layout.fontStyle[FONT_STYLE_REGRESSION_LINE_LABEL]

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
                            ...getLineLabelStyle(
                                fontStyle[FONT_STYLE_OPTION_TEXT_ALIGN],
                                FONT_STYLE_REGRESSION_LINE_LABEL,
                                layout.type
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

export default function (layout, series) {
    const dataValues = series?.map(item => item.data).flat()
    const axis = getAxis(layout.axes, AXIS_TYPE, AXIS_INDEX)
    return objectClean({
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
        plotLines: arrayClean([getTargetLine(layout), getBaseLine(layout)]),
        gridLineColor: DEFAULT_GRIDLINE_COLOR,
        labels: getLabels(axis),
        id: getAxisStringFromId(0),
    })
}
