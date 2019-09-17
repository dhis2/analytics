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

    const scale = width / config.value.length / 200

    const value = document.createElementNS(svgNS, 'text')
    value.setAttribute('x', '50%')
    value.setAttribute('y', '50%')
    value.setAttribute('text-anchor', 'middle')
    value.setAttribute(
        'dominant-baseline',
        config.title || config.subtitle ? 'mathematical' : 'middle'
    )
    value.setAttribute('font-size', '20em')
    value.setAttribute('transform', `scale(${scale})`)
    value.setAttribute('transform-origin', 'center')
    value.appendChild(document.createTextNode(config.value))

    svg.append(title, subtitle, value)

    return svg
}
