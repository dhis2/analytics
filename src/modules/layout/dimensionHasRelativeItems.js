import { hasRelativeItems } from '../relativeItems/index.js'
import { dimensionGetId } from './dimensionGetId.js'
import { dimensionGetItemIds } from './dimensionGetItemIds.js'

export const dimensionHasRelativeItems = dimension =>
    hasRelativeItems(dimensionGetId(dimension), dimensionGetItemIds(dimension))
