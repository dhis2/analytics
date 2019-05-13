import { layoutGetAllDimensions } from './layoutGetAllDimensions'
import { FIXED_DIMENSIONS } from '../fixedDimensions'

export const layoutHasDynamicDimension = layout => {
    const fixedIds = Object.keys(FIXED_DIMENSIONS)

    return layoutGetAllDimensions(layout).find(
        dimension => !fixedIds.includes(dimensionGetId(dimension))
    )
}
