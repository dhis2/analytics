import { dimensionGetItems } from './dimensionGetItems'
import { itemGetId } from './itemGetId'

export const dimensionGetItemIds = dimension =>
    dimensionGetItems(dimension).map(item => itemGetId(item))
