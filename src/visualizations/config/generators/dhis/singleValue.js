import { colors } from '@dhis2/ui'
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

// multiply text width with this factor
// to get very close to actual text width
// nb: dependent on viewbox etc
const ACTUAL_TEXT_WIDTH_FACTOR = 0.9

// multiply value text size with this factor
// to get very close to the actual number height
// as numbers don't go below the baseline like e.g. "j" and "g"
const ACTUAL_NUMBER_HEIGHT_FACTOR = 0.67

// do not allow text width to exceed this threshold
// a threshold >1 does not really make sense but text width vs viewbox is complicated
const TEXT_WIDTH_CONTAINER_WIDTH_FACTOR = 1.3

// do not allow text size to exceed this
const TEXT_SIZE_CONTAINER_HEIGHT_FACTOR = 0.6
const TEXT_SIZE_MAX_THRESHOLD = 400

// multiply text size with this factor
// to get an appropriate letter spacing
const LETTER_SPACING_TEXT_SIZE_FACTOR = (1 / 35) * -1
const LETTER_SPACING_MIN_THRESHOLD = -6
const LETTER_SPACING_MAX_THRESHOLD = -1

// fixed top margin above title/subtitle
const TOP_MARGIN_FIXED = 16

// multiply text size with this factor
// to get an appropriate sub text size
const SUB_TEXT_SIZE_FACTOR = 0.5
const SUB_TEXT_SIZE_MIN_THRESHOLD = 26
const SUB_TEXT_SIZE_MAX_THRESHOLD = 40

// multiply text size with this factor
// to get an appropriate icon padding
const ICON_PADDING_FACTOR = 0.3

// Compute text width before rendering
// Not exactly precise but close enough
const getTextWidth = (text, font) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = font
    return Math.round(
        context.measureText(text).width * ACTUAL_TEXT_WIDTH_FACTOR
    )
}

const getTextHeightForNumbers = (textSize) =>
    textSize * ACTUAL_NUMBER_HEIGHT_FACTOR

const getIconPadding = (textSize) => Math.round(textSize * ICON_PADDING_FACTOR)

const getTextSize = (
    formattedValue,
    containerWidth,
    containerHeight,
    showIcon
) => {
    let size = Math.min(
        Math.round(containerHeight * TEXT_SIZE_CONTAINER_HEIGHT_FACTOR),
        TEXT_SIZE_MAX_THRESHOLD
    )

    const widthThreshold = Math.round(
        containerWidth * TEXT_WIDTH_CONTAINER_WIDTH_FACTOR
    )

    const textWidth =
        getTextWidth(formattedValue, `${size}px Roboto`) +
        (showIcon ? getIconPadding(size) : 0)

    if (textWidth > widthThreshold) {
        size = Math.round(size * (widthThreshold / textWidth))
    }

    return size
}

const generateValueSVG = ({
    formattedValue,
    subText,
    valueColor,
    textColor,
    icon,
    noData,
    containerWidth,
    containerHeight,
    topMargin = 0,
}) => {
    const showIcon = icon && formattedValue !== noData.text

    const textSize = getTextSize(
        formattedValue,
        containerWidth,
        containerHeight,
        showIcon
    )

    const textWidth = getTextWidth(formattedValue, `${textSize}px Roboto`)

    const iconSize = textSize

    const subTextSize =
        textSize * SUB_TEXT_SIZE_FACTOR > SUB_TEXT_SIZE_MAX_THRESHOLD
            ? SUB_TEXT_SIZE_MAX_THRESHOLD
            : textSize * SUB_TEXT_SIZE_FACTOR < SUB_TEXT_SIZE_MIN_THRESHOLD
            ? SUB_TEXT_SIZE_MIN_THRESHOLD
            : textSize * SUB_TEXT_SIZE_FACTOR

    const svgValue = document.createElementNS(svgNS, 'svg')
    svgValue.setAttribute('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
    svgValue.setAttribute('width', '50%')
    svgValue.setAttribute('height', '50%')
    svgValue.setAttribute('x', '50%')
    svgValue.setAttribute('y', '50%')
    svgValue.setAttribute('style', 'overflow: visible')

    let fillColor = colors.grey900

    if (valueColor) {
        fillColor = valueColor
    } else if (formattedValue === noData.text) {
        fillColor = colors.grey600
    }

    // show icon if configured in maintenance app
    if (showIcon) {
        // embed icon to allow changing color
        // (elements with fill need to use "currentColor" for this to work)
        const iconSvgNode = document.createElementNS(svgNS, 'svg')
        iconSvgNode.setAttribute('viewBox', '0 0 48 48')
        iconSvgNode.setAttribute('width', iconSize)
        iconSvgNode.setAttribute('height', iconSize)
        iconSvgNode.setAttribute('y', (iconSize / 2 - topMargin / 2) * -1)
        iconSvgNode.setAttribute(
            'x',
            `-${(iconSize + getIconPadding(textSize) + textWidth) / 2}`
        )
        iconSvgNode.setAttribute('style', `color: ${fillColor}`)
        iconSvgNode.setAttribute('data-test', 'visualization-icon')

        const parser = new DOMParser()
        const svgIconDocument = parser.parseFromString(icon, 'image/svg+xml')

        Array.from(svgIconDocument.documentElement.children).forEach((node) =>
            iconSvgNode.appendChild(node)
        )

        svgValue.appendChild(iconSvgNode)
    }

    const letterSpacing = Math.round(textSize * LETTER_SPACING_TEXT_SIZE_FACTOR)

    const textNode = document.createElementNS(svgNS, 'text')
    textNode.setAttribute('font-size', textSize)
    textNode.setAttribute('font-weight', '300')
    textNode.setAttribute(
        'letter-spacing',
        letterSpacing < LETTER_SPACING_MIN_THRESHOLD
            ? LETTER_SPACING_MIN_THRESHOLD
            : letterSpacing > LETTER_SPACING_MAX_THRESHOLD
            ? LETTER_SPACING_MAX_THRESHOLD
            : letterSpacing
    )
    textNode.setAttribute('text-anchor', 'middle')
    textNode.setAttribute(
        'x',
        showIcon ? `${(iconSize + getIconPadding(textSize)) / 2}` : 0
    )
    textNode.setAttribute(
        'y',
        topMargin / 2 + getTextHeightForNumbers(textSize) / 2
    )
    textNode.setAttribute('fill', fillColor)
    textNode.setAttribute('data-test', 'visualization-primary-value')

    textNode.appendChild(document.createTextNode(formattedValue))

    svgValue.appendChild(textNode)

    if (subText) {
        const subTextNode = document.createElementNS(svgNS, 'text')
        subTextNode.setAttribute('text-anchor', 'middle')
        subTextNode.setAttribute('font-size', subTextSize)
        subTextNode.setAttribute('y', iconSize / 2 + topMargin / 2)
        subTextNode.setAttribute('dy', subTextSize * 1.7)
        subTextNode.setAttribute('fill', textColor)
        subTextNode.appendChild(document.createTextNode(subText))

        svgValue.appendChild(subTextNode)
    }

    return svgValue
}

const generateDashboardItem = (
    config,
    {
        svgContainer,
        width,
        height,
        valueColor,
        titleColor,
        backgroundColor,
        noData,
        icon,
    }
) => {
    svgContainer.appendChild(
        generateValueSVG({
            formattedValue: config.formattedValue,
            subText: config.subText,
            valueColor,
            textColor: titleColor,
            noData,
            icon,
            containerWidth: width,
            containerHeight: height,
        })
    )

    const container = document.createElement('div')
    container.setAttribute(
        'style',
        `display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; padding-top: 8px; ${
            backgroundColor ? `background-color:${backgroundColor};` : ''
        }`
    )

    const titleStyle = `padding: 0 8px; text-align: center; font-size: 12px; color: ${
        titleColor || '#666'
    };`

    const title = document.createElement('span')
    title.setAttribute('style', titleStyle)
    if (config.title) {
        title.appendChild(document.createTextNode(config.title))

        container.appendChild(title)
    }

    if (config.subtitle) {
        const subtitle = document.createElement('span')
        subtitle.setAttribute('style', titleStyle + ' margin-top: 4px;')

        subtitle.appendChild(document.createTextNode(config.subtitle))

        container.appendChild(subtitle)
    }

    container.appendChild(svgContainer)

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
    {
        svgContainer,
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
    if (backgroundColor) {
        svgContainer.setAttribute(
            'style',
            `background-color: ${backgroundColor};`
        )

        const background = document.createElementNS(svgNS, 'rect')
        background.setAttribute('width', '100%')
        background.setAttribute('height', '100%')
        background.setAttribute('fill', backgroundColor)
        svgContainer.appendChild(background)
    }

    const svgWrapper = document.createElementNS(svgNS, 'svg')

    // title
    const title = document.createElementNS(svgNS, 'text')

    const titleFontStyle = mergeFontStyleWithDefault(
        fontStyle && fontStyle[FONT_STYLE_VISUALIZATION_TITLE],
        FONT_STYLE_VISUALIZATION_TITLE
    )

    const titleYPosition =
        TOP_MARGIN_FIXED +
        parseInt(titleFontStyle[FONT_STYLE_OPTION_FONT_SIZE]) +
        'px'

    const titleAttributes = {
        x: getXFromTextAlign(titleFontStyle[FONT_STYLE_OPTION_TEXT_ALIGN]),
        y: titleYPosition,
        'text-anchor': getTextAnchorFromTextAlign(
            titleFontStyle[FONT_STYLE_OPTION_TEXT_ALIGN]
        ),
        'font-size': `${titleFontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`,
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
    }

    Object.entries(titleAttributes).forEach(([key, value]) =>
        title.setAttribute(key, value)
    )

    if (config.title) {
        title.appendChild(document.createTextNode(config.title))
        svgWrapper.appendChild(title)
    }

    // subtitle
    const subtitle = document.createElementNS(svgNS, 'text')

    const subtitleFontStyle = mergeFontStyleWithDefault(
        fontStyle && fontStyle[FONT_STYLE_VISUALIZATION_SUBTITLE],
        FONT_STYLE_VISUALIZATION_SUBTITLE
    )

    const subtitleAttributes = {
        x: getXFromTextAlign(subtitleFontStyle[FONT_STYLE_OPTION_TEXT_ALIGN]),
        y: titleYPosition,
        dy: `${subtitleFontStyle[FONT_STYLE_OPTION_FONT_SIZE] + 10}`,
        'text-anchor': getTextAnchorFromTextAlign(
            subtitleFontStyle[FONT_STYLE_OPTION_TEXT_ALIGN]
        ),
        'font-size': `${subtitleFontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`,
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
    }

    Object.entries(subtitleAttributes).forEach(([key, value]) =>
        subtitle.setAttribute(key, value)
    )

    if (config.subtitle) {
        subtitle.appendChild(document.createTextNode(config.subtitle))
        svgWrapper.appendChild(subtitle)
    }

    svgContainer.appendChild(svgWrapper)

    svgContainer.appendChild(
        generateValueSVG({
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
                ((config.title
                    ? parseInt(title.getAttribute('font-size'))
                    : 0) +
                    (config.subtitle
                        ? parseInt(subtitle.getAttribute('font-size'))
                        : 0)) *
                    2.5,
        })
    )

    return svgContainer
}

const shouldUseContrastColor = (inputColor = '') => {
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
    { dashboard, legendSets, fontStyle, noData, legendOptions, icon }
) {
    const legendSet = legendOptions && legendSets[0]
    const legendColor =
        legendSet && getColorByValueFromLegendSet(legendSet, config.value)
    let valueColor, titleColor, backgroundColor
    if (legendColor) {
        if (legendOptions.style === LEGEND_DISPLAY_STYLE_FILL) {
            backgroundColor = legendColor
            valueColor = titleColor =
                shouldUseContrastColor(legendColor) && colors.white
        } else {
            valueColor = legendColor
        }
    }

    parentEl.style.overflow = 'hidden'
    parentEl.style.display = 'flex'
    parentEl.style.justifyContent = 'center'

    const parentElBBox = parentEl.getBoundingClientRect()
    const width = parentElBBox.width
    const height = parentElBBox.height

    const svgContainer = document.createElementNS(svgNS, 'svg')
    svgContainer.setAttribute('xmlns', svgNS)
    svgContainer.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svgContainer.setAttribute('width', dashboard ? '100%' : width)
    svgContainer.setAttribute('height', dashboard ? '100%' : height)
    svgContainer.setAttribute('data-test', 'visualization-container')

    if (dashboard) {
        parentEl.style.borderRadius = '3px'

        return generateDashboardItem(config, {
            svgContainer,
            width,
            height,
            valueColor,
            backgroundColor,
            noData,
            icon,
            ...(legendOptions.style === LEGEND_DISPLAY_STYLE_FILL &&
            legendColor &&
            shouldUseContrastColor(legendColor)
                ? { titleColor: colors.white }
                : {}),
        })
    } else {
        parentEl.style.height = `100%`

        return generateDVItem(config, {
            svgContainer,
            width,
            height,
            valueColor,
            backgroundColor,
            titleColor,
            noData,
            icon,
            fontStyle,
        })
    }
}
