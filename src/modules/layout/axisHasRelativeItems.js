import { dimensionHasRelativeItems } from './dimensionHasRelativeItems'

export const axisHasRelativeItems = axis =>
    axis.any(dimension => dimensionHasRelativeItems(dimension))
