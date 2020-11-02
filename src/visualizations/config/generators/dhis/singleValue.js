import { colors } from '@dhis2/ui'

import { getColorByValueFromLegendSet } from '../../../../modules/legends'
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
} from '../../../../modules/fontStyle'

const svgNS = 'http://www.w3.org/2000/svg'

const generateValueSVG = (value, formattedValue, legendSet, y) => {
    const textSize = 300
    const defaultFillColor = colors.grey900

    const svgValue = document.createElementNS(svgNS, 'svg')
    svgValue.setAttribute('xmlns', svgNS)
    svgValue.setAttribute(
        'viewBox',
        `0 -${textSize + 50} ${textSize *
            0.75 *
            formattedValue.length} ${textSize + 200}`
    )

    if (y) {
        svgValue.setAttribute('y', y)
    }

    const fillColor = legendSet
        ? getColorByValueFromLegendSet(legendSet, value)
        : defaultFillColor

    const text = document.createElementNS(svgNS, 'text')
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('font-size', textSize)
    text.setAttribute('font-weight', '300')
    text.setAttribute('letter-spacing', '-5')
    text.setAttribute('x', '50%')
    text.setAttribute('fill', fillColor)
    text.setAttribute('data-test', 'visualization-primary-value')
    text.appendChild(document.createTextNode(formattedValue))

    svgValue.appendChild(text)

    return svgValue
}

const generateDashboardItem = (config, legendSet) => {
    const container = document.createElement('div')
    container.setAttribute(
        'style',
        'display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%'
    )

    const titleStyle = 'font-size: 12px; color: #666;'

    const title = document.createElement('span')
    title.setAttribute('style', titleStyle)
    if (config.title) {
        title.appendChild(document.createTextNode(config.title))

        container.appendChild(title)
    }

    const subtitle = document.createElement('span')
    subtitle.setAttribute('style', titleStyle + ' margin-top: 4px')
    if (config.subtitle) {
        subtitle.appendChild(document.createTextNode(config.subtitle))

        container.appendChild(subtitle)
    }

    container.appendChild(
        generateValueSVG(config.value, config.formattedValue, legendSet)
    )

    return container
}

const getTextAnchorFromTextAlign = textAlign => {
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

const getXFromTextAlign = textAlign => {
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

const generateDVItem = (config, legendSet, parentEl, fontStyle) => {
    const parentElBBox = parentEl.getBoundingClientRect()

    const width = parentElBBox.width
    const height = parentElBBox.height

    const svgNS = 'http://www.w3.org/2000/svg'

    const svg = document.createElementNS(svgNS, 'svg')
    svg.setAttribute('xmlns', svgNS)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')

    const title = document.createElementNS(svgNS, 'text')
    const titleFontStyle = fontStyle[FONT_STYLE_VISUALIZATION_TITLE]
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
    title.setAttribute('fill', titleFontStyle[FONT_STYLE_OPTION_TEXT_COLOR])

    title.setAttribute('data-test', 'visualization-title')

    if (config.title) {
        title.appendChild(document.createTextNode(config.title))

        svg.appendChild(title)
    }

    const subtitleFontStyle = fontStyle[FONT_STYLE_VISUALIZATION_SUBTITLE]
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
    subtitle.setAttribute(
        'fill',
        subtitleFontStyle[FONT_STYLE_OPTION_TEXT_COLOR]
    )

    subtitle.setAttribute('data-test', 'visualization-subtitle')

    if (config.subtitle) {
        subtitle.appendChild(document.createTextNode(config.subtitle))

        svg.appendChild(subtitle)
    }

    svg.appendChild(
        generateValueSVG(config.value, config.formattedValue, legendSet, 20)
    )

    return svg
}

export default function(
    config,
    parentEl,
    { dashboard, legendSets, fontStyle }
) {
    const legendSet = legendSets[0]
    parentEl.style.overflow = 'hidden'
    parentEl.style.display = 'flex'
    parentEl.style.justifyContent = 'center'

    return dashboard
        ? generateDashboardItem(config, legendSet)
        : generateDVItem(config, legendSet, parentEl, fontStyle)
}
