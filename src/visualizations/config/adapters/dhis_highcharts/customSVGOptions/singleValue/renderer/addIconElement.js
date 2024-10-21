const parser = new DOMParser()

export function addIconElement(svgString, color) {
    const svgIconDocument = parser.parseFromString(svgString, 'image/svg+xml')
    const iconElHeight = svgIconDocument.documentElement.getAttribute('height')
    const iconElWidth = svgIconDocument.documentElement.getAttribute('width')
    const iconGroup = this.renderer
        .g('icon')
        .attr({ color, 'data-test': 'visualization-icon' })
        .css({
            visibility: 'hidden',
        })

    /* Force the group element to have the same dimensions as the original
     * SVG image by adding this rect. This ensures the icon has the intended
     * whitespace around it and makes scaling and translating easier. */
    this.renderer.rect(0, 0, iconElWidth, iconElHeight).add(iconGroup)

    Array.from(svgIconDocument.documentElement.children).forEach((pathNode) => {
        /* It is also possible to use the SVGRenderer to draw the icon but that
         * approach is more error prone, so during review it was decided to just
         * append the SVG children to the iconGroup using native the native DOM
         * API. For reference see this commit, for an implementation using the
         * SVVGRenderer:
         * https://github.com/dhis2/analytics/pull/1698/commits/f95bee838e07f4cdfc3cab6e92f28f49a386a0ad */
        iconGroup.element.appendChild(pathNode)
    })

    iconGroup.add()

    return iconGroup
}
