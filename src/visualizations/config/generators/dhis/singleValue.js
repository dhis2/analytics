export default function(config, parentEl) {
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

    const title = document.createElementNS(svgNS, 'text')
    title.setAttribute('x', '50%')
    title.setAttribute('y', 48)
    title.setAttribute('text-anchor', 'middle')
    title.setAttribute('font-size', '1em')
    if (config.title) {
        title.appendChild(document.createTextNode(config.title))
    }

    const subtitle = document.createElementNS(svgNS, 'text')
    subtitle.setAttribute('x', '50%')
    subtitle.setAttribute('y', 48)
    subtitle.setAttribute('dy', 18)
    subtitle.setAttribute('text-anchor', 'middle')
    subtitle.setAttribute('font-size', '0.8em')
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

    const value = document.createElementNS(svgNS, 'text')
    value.setAttribute('text-anchor', 'middle')
    value.setAttribute('dy', 100)
    value.setAttribute('font-size', '20em')
    value.setAttribute('transform', `scale(${scale})`)
    value.appendChild(document.createTextNode(config.value))

    gValue.appendChild(value)

    svg.append(title, subtitle, gValue)

    return svg
}
