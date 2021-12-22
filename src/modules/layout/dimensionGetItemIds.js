import { dimensionGetItems } from './dimensionGetItems.js'
import { itemGetId } from './itemGetId.js'

export const dimensionGetItemIds = dimension =>
    dimensionGetItems(dimension).map(item => itemGetId(item))
