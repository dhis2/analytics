import { computeSpacingTop } from './computeSpacingTop.js'
import { ACTUAL_NUMBER_HEIGHT_FACTOR } from './constants.js'

export function computeLayoutRect(
    valueElement,
    subTextElement,
    iconElement,
    spacing
) {
    const valueRect = valueElement.getBBox()
    const containerCenterY = this.chartHeight / 2
    const containerCenterX = this.chartWidth / 2
    const minY = computeSpacingTop.call(this, spacing.valueTop)

    let width = valueRect.width
    let height = valueRect.height * ACTUAL_NUMBER_HEIGHT_FACTOR
    let sideMarginTop = 0
    let sideMarginBottom = 0

    if (iconElement) {
        width += spacing.iconGap + spacing.iconSize
    }

    if (subTextElement) {
        const subTextRect = subTextElement.getBBox()
        if (subTextRect.width > width) {
            sideMarginTop = (subTextRect.width - width) / 2
            width = subTextRect.width
        } else {
            sideMarginBottom = (width - subTextRect.width) / 2
        }
        height += spacing.subTextTop + subTextRect.height
    }

    return {
        x: containerCenterX - width / 2,
        y: Math.max(containerCenterY - height / 2, minY),
        width,
        height,
        sideMarginTop,
        sideMarginBottom,
    }
}
