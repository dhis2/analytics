import { computeSpacingTop } from './computeSpacingTop.js'

export function positionElements(
    valueElement,
    subTextElement,
    iconElement,
    spacing
) {
    console.log(
        '++++positionElements++++',
        '\nvalueElement: ',
        valueElement,
        '\nsubTextElement: ',
        subTextElement,
        '\niconElement: ',
        iconElement,
        '\nspacing: ',
        spacing,
        '\n==============='
    )
    /* Layout here refers to a virtual rect that wraps
     * all indiviual parts of the single value visualization
     * (value, subtext and icon) */
    const layoutRect = computeLayoutRect.call(
        this,
        valueElement,
        subTextElement,
        iconElement,
        spacing
    )

    // DEBUGGING THE RECT
    const debugRect = this.renderer
        .rect(layoutRect.x, layoutRect.y, layoutRect.width, layoutRect.height)
        .attr({ fill: 'orange', opacity: 0.3 })
        .add()

    const myBBox = debugRect.getBBox()

    // const valueBox = valueElement.getBBox()
    // const valueTranslateX = iconElement
    //     ? layoutRect.x + spacing.iconSize + spacing.iconGap
    //     : layoutRect.x
    // valueElement.css({
    //     transform: `translate(${valueTranslateX}px, ${layoutRect.y}px)`,
    // })
    // valueElement.attr({
    //     // TODO: cover the case where subtext is wider than value
    //     x: iconElement
    //         ? layoutRect.x + spacing.iconSize + spacing.iconGap
    //         : layoutRect.x,
    //     y: layoutRect.y,
    //     dy: valueBox.height,
    // })
    const valueElementBox = valueElement.getBBox()
    valueElement.align(
        {
            align: 'right',
            verticalAlign: 'top',
            alignByTranslate: false,
            x: valueElementBox.width * -1,
            y: valueElementBox.height * (2 / 3),
        },
        false,
        layoutRect
    )

    if (iconElement) {
        const { height } = iconElement.getBBox()
        const scaleFactor = spacing.iconSize / height

        // This all needs to be done using CSS translate because of the path cooordinates in the SVG icon
        iconElement.css({
            transform: `translate(${layoutRect.x}px, ${layoutRect.y}px) scale(${scaleFactor})`,
        })
    }

    if (subTextElement) {
        const { height: subTextHeight } = subTextElement.getBBox()
        subTextElement.attr({
            x: iconElement
                ? layoutRect.x + spacing.iconSize + spacing.iconGap
                : layoutRect.x,
            y: layoutRect.y + layoutRect.height - subTextHeight,
        })
    }

    console.log(
        '++++positionElements++++',
        '\nvalueElement: ',
        valueElement,
        '\nsubTextElement: ',
        subTextElement,
        '\niconElement: ',
        iconElement,
        '\nspacing: ',
        spacing,
        '\nlayoutRect: ',
        layoutRect,
        '\n==============='
    )
}

function computeLayoutRect(valueElement, subTextElement, iconElement, spacing) {
    const valueRect = valueElement.getBBox()
    const containerCenterY = this.chartHeight / 2
    const containerCenterX = this.chartWidth / 2
    const minY = computeSpacingTop.call(this, spacing.valueTop)

    let width = valueRect.width
    let height = valueRect.height

    if (iconElement) {
        width += spacing.iconGap + spacing.iconSize
    }

    if (subTextElement) {
        const subTextRect = subTextElement.getBBox()
        console.log(
            `What is bigger? valueWidth: ${width} subTexttWidth ${subTextRect.width}`
        )
        width = Math.max(width, subTextRect.width)
        height += spacing.subTextTop + subTextRect.height
    }

    return {
        x: containerCenterX - width / 2,
        y: Math.max(containerCenterY - height / 2, minY),
        width,
        height,
    }
}
