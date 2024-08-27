// TODO: remove this, sch thing it should not be needed
export const svgNS = 'http://www.w3.org/2000/svg'
// multiply text width with this factor
// to get very close to actual text width
// nb: dependent on viewbox etc
export const ACTUAL_TEXT_WIDTH_FACTOR = 0.9

// multiply value text size with this factor
// to get very close to the actual number height
// as numbers don't go below the baseline like e.g. "j" and "g"
export const ACTUAL_NUMBER_HEIGHT_FACTOR = 0.67

// do not allow text width to exceed this threshold
// a threshold >1 does not really make sense but text width vs viewbox is complicated
export const TEXT_WIDTH_CONTAINER_WIDTH_FACTOR = 1.3

// do not allow text size to exceed this
export const TEXT_SIZE_CONTAINER_HEIGHT_FACTOR = 0.6
export const TEXT_SIZE_MAX_THRESHOLD = 400

// multiply text size with this factor
// to get an appropriate letter spacing
export const LETTER_SPACING_TEXT_SIZE_FACTOR = (1 / 35) * -1
export const LETTER_SPACING_MIN_THRESHOLD = -6
export const LETTER_SPACING_MAX_THRESHOLD = -1

// fixed top margin above title/subtitle
export const TOP_MARGIN_FIXED = 16

// multiply text size with this factor
// to get an appropriate sub text size
export const SUB_TEXT_SIZE_FACTOR = 0.5
export const SUB_TEXT_SIZE_MIN_THRESHOLD = 26
export const SUB_TEXT_SIZE_MAX_THRESHOLD = 40

// multiply text size with this factor
// to get an appropriate icon padding
export const ICON_PADDING_FACTOR = 0.3
