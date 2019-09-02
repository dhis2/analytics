export default function(config, parentEl) {
    const width = 1024
    const height = 768
    const scale = height / parentEl.getBoundingClientRect().height

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
    title.setAttribute('font-size', '18px')
    title.setAttribute('transform', `scale(${scale})`)
    title.setAttribute('transform-origin', '50% 48')
    if (config.title) {
        title.appendChild(document.createTextNode(config.title))
    }

    const subtitle = document.createElementNS(svgNS, 'text')
    subtitle.setAttribute('x', '50%')
    subtitle.setAttribute('y', 96)
    subtitle.setAttribute('text-anchor', 'middle')
    subtitle.setAttribute('font-size', '14px')
    subtitle.setAttribute('transform', `scale(${scale})`)
    subtitle.setAttribute('transform-origin', '50% 96')
    if (config.subtitle) {
        subtitle.appendChild(document.createTextNode(config.subtitle))
    }

    const value = document.createElementNS(svgNS, 'text')
    value.setAttribute('x', '50%')
    value.setAttribute('y', '50%')
    value.setAttribute('text-anchor', 'middle')
    value.setAttribute('dominant-baseline', 'middle')
    value.setAttribute('font-size', '200px')
    value.appendChild(document.createTextNode(config.value))

    svg.append(title, subtitle, value)

    return svg
}
