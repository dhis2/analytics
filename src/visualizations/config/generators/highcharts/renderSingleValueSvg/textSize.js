// Compute text width before rendering

import {
    ACTUAL_NUMBER_HEIGHT_FACTOR,
    ACTUAL_TEXT_WIDTH_FACTOR,
    ICON_PADDING_FACTOR,
    TEXT_SIZE_CONTAINER_HEIGHT_FACTOR,
    TEXT_SIZE_MAX_THRESHOLD,
    TEXT_WIDTH_CONTAINER_WIDTH_FACTOR,
} from './constants.js'

// Not exactly precise but close enough
export const getTextWidth = (text, font) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = font
    return Math.round(
        context.measureText(text).width * ACTUAL_TEXT_WIDTH_FACTOR
    )
}

export const getTextHeightForNumbers = (textSize) =>
    textSize * ACTUAL_NUMBER_HEIGHT_FACTOR

export const getIconPadding = (textSize) =>
    Math.round(textSize * ICON_PADDING_FACTOR)

export const getTextSize = (
    formattedValue,
    containerWidth,
    containerHeight,
    showIcon
) => {
    let size = Math.min(
        Math.round(containerHeight * TEXT_SIZE_CONTAINER_HEIGHT_FACTOR),
        TEXT_SIZE_MAX_THRESHOLD
    )

    const widthThreshold = Math.round(
        containerWidth * TEXT_WIDTH_CONTAINER_WIDTH_FACTOR
    )

    const textWidth =
        getTextWidth(formattedValue, `${size}px Roboto`) +
        (showIcon ? getIconPadding(size) : 0)

    if (textWidth > widthThreshold) {
        size = Math.round(size * (widthThreshold / textWidth))
    }

    return size
}
