import { dimensionGetItems } from './dimensionGetItems'

export const dimensionIsEmpty = dimension =>
    !dimensionGetItems(dimension).length
