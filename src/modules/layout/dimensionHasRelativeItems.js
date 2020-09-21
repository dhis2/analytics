import { hasRelativeItems } from '../relativeItems'

export const dimensionHasRelativeItems = dimension =>
    hasRelativeItems(
        dimension.dimension,
        dimension.items.map(item => item.id)
    )
