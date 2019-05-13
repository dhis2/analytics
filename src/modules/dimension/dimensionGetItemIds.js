import { dimensionGetItems } from './dimensionGetItems'

export const dimensionGetItemIds = dimension =>
    dimensionGetItems(dimension).map(item => itemGetId(item))
