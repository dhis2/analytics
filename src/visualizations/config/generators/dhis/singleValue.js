import { colors, spacers } from '@dhis2/ui'
import {
    FONT_STYLE_VISUALIZATION_TITLE,
    FONT_STYLE_VISUALIZATION_SUBTITLE,
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    FONT_STYLE_OPTION_ITALIC,
    FONT_STYLE_OPTION_BOLD,
    TEXT_ALIGN_LEFT,
    TEXT_ALIGN_RIGHT,
    TEXT_ALIGN_CENTER,
    mergeFontStyleWithDefault,
    defaultFontStyle,
} from '../../../../modules/fontStyle.js'
import {
    getColorByValueFromLegendSet,
    LEGEND_DISPLAY_STYLE_FILL,
} from '../../../../modules/legends.js'

const svgNS = 'http://www.w3.org/2000/svg'

const generateValueSVG = ({
    formattedValue,
    subText,
    valueColor,
    noData,
    y,
}) => {
    const textSize = 300

    const svgValue = document.createElementNS(svgNS, 'svg')
    svgValue.setAttribute('xmlns', svgNS)
    svgValue.setAttribute(
        'viewBox',
        `0 -${textSize + 50} ${textSize * 0.75 * formattedValue.length} ${
            textSize + 200
        }`
    )

    if (y) {
        svgValue.setAttribute('y', y)
    }

    let fillColor = colors.grey900

    if (valueColor) {
        fillColor = valueColor
    } else if (formattedValue === noData.text) {
        fillColor = colors.grey600
    }

    const textNode = document.createElementNS(svgNS, 'text')
    textNode.setAttribute('text-anchor', 'middle')
    textNode.setAttribute('font-size', textSize)
    textNode.setAttribute('font-weight', '300')
    textNode.setAttribute('letter-spacing', '-5')
    textNode.setAttribute('x', '50%')
    textNode.setAttribute('fill', fillColor)
    textNode.setAttribute('data-test', 'visualization-primary-value')
    textNode.appendChild(document.createTextNode(formattedValue))

    svgValue.appendChild(textNode)

    if (subText) {
        const svgSubText = document.createElementNS(svgNS, 'svg')
        const subTextSize = 40
        svgSubText.setAttribute(
            'viewBox',
            `0 -50 ${textSize * 0.75 * formattedValue.length} ${textSize + 200}`
        )

        if (y) {
            svgSubText.setAttribute('y', y)
        }

        const subTextNode = document.createElementNS(svgNS, 'text')
        subTextNode.setAttribute('text-anchor', 'middle')
        subTextNode.setAttribute('font-size', subTextSize)
        subTextNode.setAttribute('x', '50%')
        subTextNode.setAttribute('x', '50%')
        subTextNode.setAttribute('fill', colors.grey600)
        subTextNode.appendChild(document.createTextNode(subText))

        svgSubText.appendChild(subTextNode)

        svgValue.appendChild(svgSubText)
    }

    return svgValue
}

const generateDashboardItem = (config, { valueColor, noData }) => {
    const container = document.createElement('div')
    container.setAttribute(
        'style',
        'display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%'
    )

    const titleStyle = `font-size: 12px; color: #666; position: absolute; top: ${spacers.dp8};`

    const title = document.createElement('span')
    title.setAttribute('style', titleStyle)
    if (config.title) {
        title.appendChild(document.createTextNode(config.title))

        container.appendChild(title)
    }

    const subtitle = document.createElement('span')
    subtitle.setAttribute('style', titleStyle + ' margin-top: 18px;')
    if (config.subtitle) {
        subtitle.appendChild(document.createTextNode(config.subtitle))

        container.appendChild(subtitle)
    }

    container.appendChild(
        generateValueSVG({
            formattedValue: config.formattedValue,
            subText: config.subText,
            valueColor,
            noData,
            y: 40,
        })
    )

    return container
}

const getTextAnchorFromTextAlign = (textAlign) => {
    switch (textAlign) {
        default:
        case TEXT_ALIGN_LEFT:
            return 'start'
        case TEXT_ALIGN_CENTER:
            return 'middle'
        case TEXT_ALIGN_RIGHT:
            return 'end'
    }
}

const getXFromTextAlign = (textAlign) => {
    switch (textAlign) {
        default:
        case TEXT_ALIGN_LEFT:
            return '1%'
        case TEXT_ALIGN_CENTER:
            return '50%'
        case TEXT_ALIGN_RIGHT:
            return '99%'
    }
}

const generateDVItem = (
    config,
    { valueColor, titleColor, parentEl, fontStyle, noData }
) => {
    const parentElBBox = parentEl.getBoundingClientRect()

    const width = parentElBBox.width
    const height = parentElBBox.height

    const svgNS = 'http://www.w3.org/2000/svg'

    const svg = document.createElementNS(svgNS, 'svg')
    svg.setAttribute('xmlns', svgNS)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
    svg.setAttribute('data-test', 'visualization-container')

    const title = document.createElementNS(svgNS, 'text')
    const titleFontStyle = mergeFontStyleWithDefault(
        fontStyle && fontStyle[FONT_STYLE_VISUALIZATION_TITLE],
        FONT_STYLE_VISUALIZATION_TITLE
    )
    title.setAttribute(
        'x',
        getXFromTextAlign(titleFontStyle[FONT_STYLE_OPTION_TEXT_ALIGN])
    )
    title.setAttribute('y', 28)
    title.setAttribute(
        'text-anchor',
        getTextAnchorFromTextAlign(titleFontStyle[FONT_STYLE_OPTION_TEXT_ALIGN])
    )
    title.setAttribute(
        'font-size',
        `${titleFontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`
    )
    title.setAttribute(
        'font-weight',
        titleFontStyle[FONT_STYLE_OPTION_BOLD]
            ? FONT_STYLE_OPTION_BOLD
            : 'normal'
    )
    title.setAttribute(
        'font-style',
        titleFontStyle[FONT_STYLE_OPTION_ITALIC]
            ? FONT_STYLE_OPTION_ITALIC
            : 'normal'
    )
    if (
        titleColor &&
        titleFontStyle[FONT_STYLE_OPTION_TEXT_COLOR] ===
            defaultFontStyle[FONT_STYLE_VISUALIZATION_TITLE][
                FONT_STYLE_OPTION_TEXT_COLOR
            ]
    ) {
        title.setAttribute('fill', titleColor)
    } else {
        title.setAttribute('fill', titleFontStyle[FONT_STYLE_OPTION_TEXT_COLOR])
    }

    title.setAttribute('data-test', 'visualization-title')

    if (config.title) {
        title.appendChild(document.createTextNode(config.title))

        svg.appendChild(title)
    }

    const subtitleFontStyle = mergeFontStyleWithDefault(
        fontStyle && fontStyle[FONT_STYLE_VISUALIZATION_SUBTITLE],
        FONT_STYLE_VISUALIZATION_SUBTITLE
    )
    const subtitle = document.createElementNS(svgNS, 'text')
    subtitle.setAttribute(
        'x',
        getXFromTextAlign(subtitleFontStyle[FONT_STYLE_OPTION_TEXT_ALIGN])
    )
    subtitle.setAttribute('y', 28)
    subtitle.setAttribute('dy', 22)
    subtitle.setAttribute(
        'text-anchor',
        getTextAnchorFromTextAlign(
            subtitleFontStyle[FONT_STYLE_OPTION_TEXT_ALIGN]
        )
    )
    subtitle.setAttribute(
        'font-size',
        `${subtitleFontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`
    )
    subtitle.setAttribute(
        'font-weight',
        subtitleFontStyle[FONT_STYLE_OPTION_BOLD]
            ? FONT_STYLE_OPTION_BOLD
            : 'normal'
    )
    subtitle.setAttribute(
        'font-style',
        subtitleFontStyle[FONT_STYLE_OPTION_ITALIC]
            ? FONT_STYLE_OPTION_ITALIC
            : 'normal'
    )

    if (
        titleColor &&
        subtitleFontStyle[FONT_STYLE_OPTION_TEXT_COLOR] ===
            defaultFontStyle[FONT_STYLE_VISUALIZATION_SUBTITLE][
                FONT_STYLE_OPTION_TEXT_COLOR
            ]
    ) {
        subtitle.setAttribute('fill', titleColor)
    } else {
        subtitle.setAttribute(
            'fill',
            subtitleFontStyle[FONT_STYLE_OPTION_TEXT_COLOR]
        )
    }

    subtitle.setAttribute('data-test', 'visualization-subtitle')

    if (config.subtitle) {
        subtitle.appendChild(document.createTextNode(config.subtitle))

        svg.appendChild(subtitle)
    }

    svg.appendChild(
        generateValueSVG({
            formattedValue: config.formattedValue,
            subText: config.subText,
            valueColor,
            noData,
            y: 20,
        })
    )

    return svg
}

const shouldUseContrastColor = (inputColor) => {
    // based on https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
    var color =
        inputColor.charAt(0) === '#' ? inputColor.substring(1, 7) : inputColor
    var r = parseInt(color.substring(0, 2), 16) // hexToR
    var g = parseInt(color.substring(2, 4), 16) // hexToG
    var b = parseInt(color.substring(4, 6), 16) // hexToB
    var uicolors = [r / 255, g / 255, b / 255]
    var c = uicolors.map((col) => {
        if (col <= 0.03928) {
            return col / 12.92
        }
        return Math.pow((col + 0.055) / 1.055, 2.4)
    })
    var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
    return L <= 0.179
}

export default function (
    config,
    parentEl,
    { dashboard, legendSets, fontStyle, noData, legendOptions }
) {
    const legendSet = legendOptions && legendSets[0]
    const legendColor =
        legendSet && getColorByValueFromLegendSet(legendSet, config.value)
    let valueColor, titleColor
    if (legendColor) {
        if (legendOptions.style === LEGEND_DISPLAY_STYLE_FILL) {
            parentEl.style.background = legendColor
            valueColor = titleColor =
                shouldUseContrastColor(legendColor) && colors.white
        } else {
            valueColor = legendColor
        }
    }

    parentEl.style.overflow = 'hidden'
    parentEl.style.display = 'flex'
    parentEl.style.justifyContent = 'center'
    parentEl.style.borderRadius = spacers.dp8

    if (dashboard) {
        return generateDashboardItem(config, { valueColor, noData })
    } else {
        parentEl.style.margin = spacers.dp8
        parentEl.style.height = `calc(100% - (${spacers.dp8} * 2))`
        return generateDVItem(config, {
            valueColor,
            titleColor,
            parentEl,
            fontStyle,
            noData,
        })
    }
}
