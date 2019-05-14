import { layoutGetAllDimensions } from './layoutGetAllDimensions'
import { dimensionGetId } from './dimensionGetId'
import { FIXED_DIMENSIONS } from '../fixedDimensions'

export const layoutHasDynamicDimension = layout => {
    const fixedIds = Object.keys(FIXED_DIMENSIONS)

    return Boolean(
        layoutGetAllDimensions(layout).find(
            dimension => !fixedIds.includes(dimensionGetId(dimension))
        )
    )
}
