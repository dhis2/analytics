export function checkIfFitsWithinContainer(
    availableSpace,
    valueElement,
    subTextElement,
    icon,
    subText,
    spacing
) {
    const valueRect = valueElement.getBBox()
    const subTextRect = subTextElement.getBBox()
    const requiredValueWidth = icon
        ? valueRect.width + spacing.iconGap + spacing.iconSize
        : valueRect.width
    const requiredHeight = subText
        ? valueRect.height + spacing.subTextTop + subTextRect.height
        : valueRect.height
    const fitsHorizontally =
        availableSpace.width > requiredValueWidth &&
        availableSpace.width > subTextRect.width
    const fitsVertically = availableSpace.height > requiredHeight

    return fitsHorizontally && fitsVertically
}
