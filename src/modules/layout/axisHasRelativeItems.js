import { dimensionHasRelativeItems } from './dimensionHasRelativeItems.js'

export const axisHasRelativeItems = (axis) =>
    axis.some((dimension) => dimensionHasRelativeItems(dimension))
