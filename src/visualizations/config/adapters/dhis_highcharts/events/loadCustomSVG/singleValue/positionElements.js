import { computeLayoutRect } from './computeLayoutRect.js'
import { ACTUAL_NUMBER_HEIGHT_FACTOR } from './constants.js'

export function positionElements(
    valueElement,
    subTextElement,
    iconElement,
    spacing
) {
    const valueElementBox = valueElement.getBBox()
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

    valueElement.align(
        {
            align: 'right',
            verticalAlign: 'top',
            alignByTranslate: false,
            x: (valueElementBox.width + layoutRect.sideMarginTop) * -1,
            y: valueElementBox.height * ACTUAL_NUMBER_HEIGHT_FACTOR,
        },
        false,
        layoutRect
    )

    if (iconElement) {
        const { height } = iconElement.getBBox()
        const scale = spacing.iconSize / height
        const translateX = layoutRect.x + layoutRect.sideMarginTop
        const iconHeight = height * scale
        const valueElementHeight =
            valueElementBox.height * ACTUAL_NUMBER_HEIGHT_FACTOR
        const translateY = layoutRect.y + (valueElementHeight - iconHeight) / 2

        /* The icon is a <g> with <path> elements that contain coordinates.
         * These path-coordinates only scale correctly when using CSS translate */
        iconElement.css({
            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        })
    }

    if (subTextElement) {
        subTextElement.align(
            {
                align: 'left',
                verticalAlign: 'bottom',
                alignByTranslate: false,
                x: layoutRect.sideMarginBottom,
            },
            false,
            layoutRect
        )
    }
}
