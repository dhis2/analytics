import {
    defaultFontStyle,
    FONT_STYLE_OPTION_BOLD,
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_ITALIC,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_VISUALIZATION_SUBTITLE,
    FONT_STYLE_VISUALIZATION_TITLE,
    mergeFontStyleWithDefault,
} from '../../../../../modules/fontStyle.js'
import { TOP_MARGIN_FIXED } from './constants.js'
import { generateValueSVG } from './generateValueSVG.js'
import { getTextAnchorFromTextAlign } from './getTextAnchorFromTextAlign.js'
import { getXFromTextAlign } from './getXFromTextAlign.js'

export const generateDVItem = (
    config,
    {
        renderer,
        width,
        height,
        valueColor,
        noData,
        backgroundColor,
        titleColor,
        fontStyle,
        icon,
    }
) => {
    backgroundColor = 'red'
    if (backgroundColor) {
        renderer
            .rect(0, 0, width, height)
            .attr({ fill: backgroundColor, width: '100%', height: '100%' })
            .add()
    }

    // TITLE
    const titleFontStyle = mergeFontStyleWithDefault(
        fontStyle && fontStyle[FONT_STYLE_VISUALIZATION_TITLE],
        FONT_STYLE_VISUALIZATION_TITLE
    )

    const titleYPosition =
        TOP_MARGIN_FIXED +
        parseInt(titleFontStyle[FONT_STYLE_OPTION_FONT_SIZE]) +
        'px'

    const titleFontSize = `${titleFontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`

    renderer
        .text(config.title)
        .attr({
            x: getXFromTextAlign(titleFontStyle[FONT_STYLE_OPTION_TEXT_ALIGN]),
            y: titleYPosition,
            'text-anchor': getTextAnchorFromTextAlign(
                titleFontStyle[FONT_STYLE_OPTION_TEXT_ALIGN]
            ),
            'font-size': titleFontSize,
            'font-weight': titleFontStyle[FONT_STYLE_OPTION_BOLD]
                ? FONT_STYLE_OPTION_BOLD
                : 'normal',
            'font-style': titleFontStyle[FONT_STYLE_OPTION_ITALIC]
                ? FONT_STYLE_OPTION_ITALIC
                : 'normal',
            'data-test': 'visualization-title',
            fill:
                titleColor &&
                titleFontStyle[FONT_STYLE_OPTION_TEXT_COLOR] ===
                    defaultFontStyle[FONT_STYLE_VISUALIZATION_TITLE][
                        FONT_STYLE_OPTION_TEXT_COLOR
                    ]
                    ? titleColor
                    : titleFontStyle[FONT_STYLE_OPTION_TEXT_COLOR],
        })
        .add()

    // SUBTITLE
    const subtitleFontStyle = mergeFontStyleWithDefault(
        fontStyle && fontStyle[FONT_STYLE_VISUALIZATION_SUBTITLE],
        FONT_STYLE_VISUALIZATION_SUBTITLE
    )
    const subtitleFontSize = `${subtitleFontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`

    if (config.subtitle) {
        renderer
            .text(config.subtitle)
            .attr({
                x: getXFromTextAlign(
                    subtitleFontStyle[FONT_STYLE_OPTION_TEXT_ALIGN]
                ),
                y: titleYPosition,
                dy: `${subtitleFontStyle[FONT_STYLE_OPTION_FONT_SIZE] + 10}`,
                'text-anchor': getTextAnchorFromTextAlign(
                    subtitleFontStyle[FONT_STYLE_OPTION_TEXT_ALIGN]
                ),
                'font-size': subtitleFontSize,
                'font-weight': subtitleFontStyle[FONT_STYLE_OPTION_BOLD]
                    ? FONT_STYLE_OPTION_BOLD
                    : 'normal',
                'font-style': subtitleFontStyle[FONT_STYLE_OPTION_ITALIC]
                    ? FONT_STYLE_OPTION_ITALIC
                    : 'normal',
                fill:
                    titleColor &&
                    subtitleFontStyle[FONT_STYLE_OPTION_TEXT_COLOR] ===
                        defaultFontStyle[FONT_STYLE_VISUALIZATION_SUBTITLE][
                            FONT_STYLE_OPTION_TEXT_COLOR
                        ]
                        ? titleColor
                        : subtitleFontStyle[FONT_STYLE_OPTION_TEXT_COLOR],
                'data-test': 'visualization-subtitle',
            })
            .add()
    }

    generateValueSVG({
        renderer,
        formattedValue: config.formattedValue,
        subText: config.subText,
        valueColor,
        textColor: titleColor,
        noData,
        icon,
        containerWidth: width,
        containerHeight: height,
        topMargin:
            TOP_MARGIN_FIXED +
            ((config.title ? parseInt(titleFontSize) : 0) +
                (config.subtitle ? parseInt(subtitleFontSize) : 0)) *
                2.5,
    })
}
