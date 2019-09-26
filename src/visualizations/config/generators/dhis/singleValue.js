const svgNS = 'http://www.w3.org/2000/svg'

const generateValueSVG = (value, y) => {
    const textSize = 300

    const svgValue = document.createElementNS(svgNS, 'svg')
    svgValue.setAttribute('xmlns', svgNS)
    svgValue.setAttribute(
        'viewBox',
        `0 -${textSize} ${textSize * 0.56 * value.length} ${textSize + 50}`
    )

    if (y) {
        svgValue.setAttribute('y', y)
    }

    const text = document.createElementNS(svgNS, 'text')
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('font-size', textSize)
    text.setAttribute('x', '50%')
    text.appendChild(document.createTextNode(value))

    svgValue.appendChild(text)

    return svgValue
}

const generateDashboardItem = config => {
    const container = document.createElement('div')
    container.setAttribute(
        'style',
        'display: flex; flex-direction: column; align-items: center; width: 100%; height: 100%'
    )

    const titleSubtitleStyle = 'font-size: 12px; color: #666'

    const title = document.createElement('span')
    title.setAttribute('style', titleSubtitleStyle)
    if (config.title) {
        title.appendChild(document.createTextNode(config.title))

        container.appendChild(title)
    }

    const subtitle = document.createElement('span')
    subtitle.setAttribute('style', titleSubtitleStyle)
    if (config.subtitle) {
        subtitle.appendChild(document.createTextNode(config.subtitle))

        container.appendChild(subtitle)
    }

    container.appendChild(generateValueSVG(config.value))

    return container
}

const generateDVItem = (config, parentEl) => {
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

    svg.appendChild(generateValueSVG(config.value, 20))

    return svg
}

export default function(config, parentEl, { dashboard }) {
    parentEl.style.overflow = 'hidden'
    parentEl.style.display = 'flex'
    parentEl.style.justifyContent = 'center'

    return dashboard
        ? generateDashboardItem(config)
        : generateDVItem(config, parentEl)
}
