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

    /* The code below makes some assumptions about icon SVGs:
     * 1. The SVG children are all <path> elements and they are not nested
     * 2. Only the `d`, `fill-rule`, `clip-rule` and `fill` attributes are used */
    Array.from(svgIconDocument.documentElement.children).forEach((pathNode) => {
        /* Highcharts expects an array of letters and numbers but the
         * d-attribute string only puts spaces in between adjacent number,
         * not between letter and numbers. */
        const d = pathNode
            .getAttribute('d')
            // Add space after letter when followed by number
            .replace(/([A-Z])([0-9])/g, '$1 $2')
            // Add space after number when followed by letter
            .replace(/([0-9])([A-Z])/g, '$1 $2')
            .split(' ')
            .map((point) =>
                isNaN(parseFloat(point)) ? point : parseFloat(point)
            )
        const attr = {}
        const fillRule = pathNode.getAttribute('fill-rule')
        const clipRule = pathNode.getAttribute('clip-rule')
        const fill = pathNode.getAttribute('fill')

        if (fillRule) {
            attr['fill-rule'] = fillRule
        }

        if (clipRule) {
            attr['clip-rule'] = clipRule
        }
        if (fill) {
            attr['fill'] = fill
        }

        this.renderer.path(d).attr(attr).add(iconGroup)

        /* NB: the line below does exactly the same as the lines above,
         * but does not user the SVGRenderer. We could consider switching
         * to this if it turns out that not all the assumptions about SVG
         * icons are correct. */
        // iconGroup.element.appendChild(pathNode)
    })

    iconGroup.add()

    return iconGroup
}
