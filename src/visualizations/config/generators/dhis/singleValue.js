import { getColorByValueFromLegendSet } from "../../../../modules/legends"

const svgNS = 'http://www.w3.org/2000/svg'

const generateValueSVG = (value, legendSet, y) => {
    const textSize = 300
    const defaultFillColor = "#000000"

    const svgValue = document.createElementNS(svgNS, 'svg')
    svgValue.setAttribute('xmlns', svgNS)
    svgValue.setAttribute(
        'viewBox',
        `0 -${textSize + 50} ${textSize * 0.75 * value.length} ${textSize +
            200}`
    )

    if (y) {
        svgValue.setAttribute('y', y)
    }

    const fillColor = legendSet ? getColorByValueFromLegendSet(legendSet, value) : defaultFillColor

    const text = document.createElementNS(svgNS, 'text')
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('font-size', textSize)
    text.setAttribute('font-weight', '300')
    text.setAttribute('letter-spacing', '-5')
    text.setAttribute('x', '50%')
    text.setAttribute('fill', fillColor)
    text.appendChild(document.createTextNode(value))

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

    container.appendChild(generateValueSVG(config.value, legendSet))

    return container
}

const generateDVItem = (config, legendSet, parentEl) => {
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
    title.setAttribute('x', '50%')
    title.setAttribute('y', 28)
    title.setAttribute('text-anchor', 'middle')
    title.setAttribute('font-size', '18px')
    title.setAttribute('fill', '#111')
    if (config.title) {
        title.appendChild(document.createTextNode(config.title))

        svg.appendChild(title)
    }

    const subtitle = document.createElementNS(svgNS, 'text')
    subtitle.setAttribute('x', '50%')
    subtitle.setAttribute('y', 28)
    subtitle.setAttribute('dy', 22)
    subtitle.setAttribute('text-anchor', 'middle')
    subtitle.setAttribute('font-size', '14px')
    subtitle.setAttribute('fill', '#111')
    if (config.subtitle) {
        subtitle.appendChild(document.createTextNode(config.subtitle))

        svg.appendChild(subtitle)
    }

    svg.appendChild(generateValueSVG(config.value, legendSet, 20))

    return svg
}

export default function(config, parentEl, { dashboard, legendSets }) {
    const legendSet = legendSets[0]
    parentEl.style.overflow = 'hidden'
    parentEl.style.display = 'flex'
    parentEl.style.justifyContent = 'center'

    return dashboard
        ? generateDashboardItem(config, legendSet)
        : generateDVItem(config, legendSet, parentEl)
}
