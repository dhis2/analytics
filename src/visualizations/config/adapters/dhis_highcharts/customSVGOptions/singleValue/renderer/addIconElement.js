const parser = new DOMParser()

export function addIconElement(svgString, color) {
    const svgIconDocument = parser.parseFromString(svgString, 'image/svg+xml')
    const iconElHeight = svgIconDocument.documentElement.getAttribute('height')
    const iconElWidth = svgIconDocument.documentElement.getAttribute('width')
    const iconGroup = this.renderer
        .g('icon')
        .attr('data-test', 'visualization-icon')
        .css({
            color,
        })
    /* Force the group element to have the same dimensions as the original
     * SVG image by adding this rect. This ensures the icon has the intended
     * whitespace around it and makes scaling and translating easier. */
    this.renderer.rect(0, 0, iconElWidth, iconElHeight).add(iconGroup)

    Array.from(svgIconDocument.documentElement.children).forEach((node) =>
        iconGroup.element.appendChild(node)
    )

    iconGroup.add()

    return iconGroup
}
