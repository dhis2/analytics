export default function(config, parentEl, { dashboard }) {
    parentEl.style.overflow = 'hidden'
    parentEl.style.display = 'flex'
    parentEl.style.justifyContent = 'center'

    const parentElBBox = parentEl.getBoundingClientRect()

    const width = parentElBBox.width
    const height = parentElBBox.height

    const svgNS = 'http://www.w3.org/2000/svg'

    const svg = document.createElementNS(svgNS, 'svg')
    svg.setAttribute('xmlns', svgNS)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')

    const titleFontSize = dashboard ? '0.8em' : '18px'
    const title = document.createElementNS(svgNS, 'text')
    title.setAttribute('x', '50%')
    title.setAttribute('y', dashboard ? 15 : 48)
    title.setAttribute('text-anchor', 'middle')
    title.setAttribute('font-size', titleFontSize)
    if (config.title) {
        title.appendChild(document.createTextNode(config.title))
    }

    const subtitleFontSize = dashboard ? '0.8em' : '14px'
    const subtitle = document.createElementNS(svgNS, 'text')
    subtitle.setAttribute('x', '50%')
    subtitle.setAttribute('y', dashboard ? 15 : 48)
    subtitle.setAttribute('dy', dashboard ? 16 : 22)
    subtitle.setAttribute('text-anchor', 'middle')
    subtitle.setAttribute('font-size', subtitleFontSize)
    if (config.subtitle) {
        subtitle.appendChild(document.createTextNode(config.subtitle))
    }

    const scale = width / (200 * config.value.length)

    // The group here is used to keep the value centered within the SVG viewport.
    // Because scale is used on the text node, it turned out to be difficult to center the text node itself.
    // transform-origin does not work consistently across browsers.
    // g is taking care of centering
    // text node is only caring about scaling and always having origin at 0,0 of the parent node (g)
    // with vertical offset to compensate for the dominant-baseline (which does not work in Edge)
    const gValue = document.createElementNS(svgNS, 'g')
    gValue.setAttribute('transform', `translate(${width / 2} ${height / 2})`)

    const valueVertOffset =
        dashboard && (config.title || config.subtitle) ? 160 : 100
    const value = document.createElementNS(svgNS, 'text')
    value.setAttribute('text-anchor', 'middle')
    value.setAttribute('dy', valueVertOffset)
    value.setAttribute('font-size', '20em')
    value.setAttribute('transform', `scale(${scale})`)
    value.appendChild(document.createTextNode(config.value))

    gValue.appendChild(value)

    svg.append(title, subtitle, gValue)

    return svg
}
