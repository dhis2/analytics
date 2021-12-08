import { hasRelativeItems } from '../relativeItems'
import { dimensionGetId } from './dimensionGetId'
import { dimensionGetItemIds } from './dimensionGetItemIds'

export const dimensionHasRelativeItems = (dimension) =>
    hasRelativeItems(dimensionGetId(dimension), dimensionGetItemIds(dimension))
