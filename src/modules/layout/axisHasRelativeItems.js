import { dimensionHasRelativeItems } from './dimensionHasRelativeItems'

export const axisHasRelativeItems = axis =>
    axis.some(dimension => dimensionHasRelativeItems(dimension))
