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
    FONT_STYLE_BASE_LINE_LABEL,
    FONT_STYLE_TARGET_LINE_LABEL,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    FONT_STYLE_SERIES_AXIS_LABELS,
} from '../../../../../modules/fontStyle'
import { VIS_TYPE_GAUGE } from '../../../../../modules/visTypes'
import { getTextAlignOption } from '../getTextAlignOption'

const DEFAULT_MAX_VALUE = 100

const DEFAULT_TARGET_LINE_LABEL = i18n.t('Target')
const DEFAULT_BASE_LINE_LABEL = i18n.t('Base')

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

function getPlotLine(value, label, fontStyle, fontStyleType) {
    const verticalAlign = getTextAlignOption(
        fontStyle[FONT_STYLE_OPTION_TEXT_ALIGN],
        fontStyleType,
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

const getLabels = fontStyle => ({
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
})

export default function(layout, series, legendSet) {
    const plotLines = arrayClean([
        isNumber(layout.baseLineValue)
            ? getPlotLine(
                  layout.baseLineValue,
                  layout.baseLineLabel || DEFAULT_BASE_LINE_LABEL,
                  layout.fontStyle[FONT_STYLE_BASE_LINE_LABEL],
                  FONT_STYLE_BASE_LINE_LABEL
              )
            : null,
        isNumber(layout.targetLineValue)
            ? getPlotLine(
                  layout.targetLineValue,
                  layout.targetLineLabel || DEFAULT_TARGET_LINE_LABEL,
                  layout.fontStyle[FONT_STYLE_TARGET_LINE_LABEL],
                  FONT_STYLE_TARGET_LINE_LABEL
              )
            : null,
    ])
    const fillColor =
        layout.legendDisplayStyle === LEGEND_DISPLAY_STYLE_FILL && legendSet
            ? getColorByValueFromLegendSet(legendSet, series[0].data)
            : undefined
    return objectClean({
        min: isNumber(layout.rangeAxisMinValue) ? layout.rangeAxisMinValue : 0,
        max: isNumber(layout.rangeAxisMaxValue)
            ? layout.rangeAxisMaxValue
            : DEFAULT_MAX_VALUE,
        lineWidth: 0,
        minorTickInterval: null,
        tickLength: 0,
        tickAmount: 0,
        tickPositioner: function() {
            return [this.min, this.max]
        },
        minColor: fillColor,
        maxColor: fillColor,
        labels: getLabels(layout.fontStyle[FONT_STYLE_SERIES_AXIS_LABELS]),
        title: {
            text: series[0].name,
        },
        ...(plotLines.length && {
            plotLines,
        }),
    })
}
