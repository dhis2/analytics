import objectClean from 'd2-utilizr/lib/objectClean'
import isNumeric from 'd2-utilizr/lib/isNumeric'
import isString from 'd2-utilizr/lib/isString'

import { isVerticalType } from '../../../../modules/visTypes'
import {
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
} from '../../../../modules/fontStyle'
import { getTextAlignOption } from './getTextAlignOption'
import getFormatter from './getFormatter'

const DEFAULT_MIN_VALUE = 0
const DEFAULT_GRIDLINE_COLOR = '#E1E1E1'

const getPlotLineStyle = fontStyle => ({
    color: fontStyle[FONT_STYLE_OPTION_TEXT_COLOR] || '#000',
    width: 2,
    zIndex: 4,
})

const getPlotLineLabelStyle = fontStyle => ({
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
})

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

const getLineLabelStyle = (fontStyle, fontStyleType, isVertical) => {
    const alignKey = isVertical ? 'verticalAlign' : 'align'
    const alignValue = getTextAlignOption(fontStyle, fontStyleType, isVertical)
    const offsetKey = isVertical ? 'y' : 'x'
    const offsetValue = getLabelOffsetFromTextAlign(fontStyle)

    const result = { [alignKey]: alignValue, [offsetKey]: offsetValue }
    if (isVertical) {
        result.align = getTextAlignOption(fontStyle, fontStyleType)
    }
    return result
}

export const getMinValue = (minValue, dataValues) =>
    isNumeric(minValue)
        ? minValue
        : dataValues?.some(value => value < DEFAULT_MIN_VALUE)
        ? undefined
        : DEFAULT_MIN_VALUE

export const getMaxValue = (maxValue, dataValues) =>
    isNumeric(maxValue)
        ? maxValue
        : dataValues?.every(value => value < DEFAULT_MIN_VALUE)
        ? DEFAULT_MIN_VALUE
        : undefined

export const getRegressionLine = (regressionLine = {}, visType, isVertical) => {
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
                                isVertical || isVerticalType(visType)
                            ),
                        })
                      : undefined,
              })
          )
        : undefined
}

export const getLabels = axis => {
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

export const getGridLineColor = () => DEFAULT_GRIDLINE_COLOR
