import { colors } from '@dhis2/ui'
import {
    svgNS,
    LETTER_SPACING_MAX_THRESHOLD,
    LETTER_SPACING_MIN_THRESHOLD,
    LETTER_SPACING_TEXT_SIZE_FACTOR,
    SUB_TEXT_SIZE_FACTOR,
    SUB_TEXT_SIZE_MAX_THRESHOLD,
    SUB_TEXT_SIZE_MIN_THRESHOLD,
} from './constants.js'
import {
    getIconPadding,
    getTextHeightForNumbers,
    getTextSize,
    getTextWidth,
} from './textSize.js'

export const generateValueSVG = ({
    renderer,
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
        console.log('old', iconSize)
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

    renderer.box.appendChild(svgValue)
}
