import arrayClean from 'd2-utilizr/lib/arrayClean'
import isNumber from 'd2-utilizr/lib/isNumber'
import objectClean from 'd2-utilizr/lib/objectClean'
import i18n from '@dhis2/d2-i18n'
import {
    getColorByValueFromLegendSet,
    LEGEND_DISPLAY_STYLE_FILL,
} from '../../../../../modules/legends'
import {
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_BOLD,
    FONT_STYLE_OPTION_ITALIC,
    TEXT_ALIGN_LEFT,
    TEXT_ALIGN_RIGHT,
    TEXT_ALIGN_CENTER,
    FONT_STYLE_REGRESSION_LINE_LABEL,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    FONT_STYLE_AXIS_LABELS,
    defaultFontStyle,
} from '../../../../../modules/fontStyle'
import { VIS_TYPE_GAUGE } from '../../../../../modules/visTypes'
import { getTextAlignOption } from '../getTextAlignOption'
import { getAxis } from '../../../../util/axes'

const DEFAULT_MAX_VALUE = 100
const DEFAULT_TARGET_LINE_LABEL = i18n.t('Target')
const DEFAULT_BASE_LINE_LABEL = i18n.t('Base')
const AXIS_TYPE = 'RANGE'
const AXIS_INDEX = 0

const getLabelOffsetFromTextAlign = textAlign => {
    switch (textAlign) {
        case TEXT_ALIGN_LEFT:
            return -10
        case TEXT_ALIGN_RIGHT:
            return 10
        case TEXT_ALIGN_CENTER:
        default:
            return 0
    }
}

function getPlotLine(regressionLine = {}, defaultLabel) {
    const value = regressionLine.value
    if (!isNumber(value)) {
        return null
    }
    const label = regressionLine.title?.text || defaultLabel
    const fontStyle = {
        ...defaultFontStyle[FONT_STYLE_REGRESSION_LINE_LABEL],
        ...regressionLine.title?.fontStyle,
    }

    const verticalAlign = getTextAlignOption(
        fontStyle[FONT_STYLE_OPTION_TEXT_ALIGN],
        FONT_STYLE_REGRESSION_LINE_LABEL,
        VIS_TYPE_GAUGE
    )
    const y = getLabelOffsetFromTextAlign(
        fontStyle[FONT_STYLE_OPTION_TEXT_ALIGN]
    )
    return {
        value,
        zIndex: 5,
        width: 1,
        color: fontStyle[FONT_STYLE_OPTION_TEXT_COLOR] || '#000',
        ...(label && {
            label: {
                text: `${label}: ${value}`,
                verticalAlign,
                y,
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
            },
        }),
    }
}

const getLabels = axis => {
    const fontStyle = {
        ...defaultFontStyle[FONT_STYLE_AXIS_LABELS],
        ...axis.label?.fontStyle,
    }

    return {
        y: parseInt(fontStyle[FONT_STYLE_OPTION_FONT_SIZE], 10) + 7,
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

export default function (layout, series, legendSet) {
    const axis = getAxis(layout.axes, AXIS_TYPE, AXIS_INDEX)

    const plotLines = arrayClean([
        getPlotLine(axis.baseLine, DEFAULT_BASE_LINE_LABEL),
        getPlotLine(axis.targetLine, DEFAULT_TARGET_LINE_LABEL),
    ])
    const fillColor =
        layout.legendDisplayStyle === LEGEND_DISPLAY_STYLE_FILL && legendSet
            ? getColorByValueFromLegendSet(legendSet, series[0].data)
            : undefined
    return objectClean({
        min: isNumber(axis.minValue) ? axis.minValue : 0,
        max: isNumber(axis.maxValue) ? axis.maxValue : DEFAULT_MAX_VALUE,
        lineWidth: 0,
        minorTickInterval: null,
        tickLength: 0,
        tickAmount: 0,
        tickPositioner: function () {
            return [this.min, this.max]
        },
        minColor: fillColor,
        maxColor: fillColor,
        labels: getLabels(axis),
        title: {
            text: series[0].name,
        },
        ...(plotLines.length && {
            plotLines,
        }),
    })
}
