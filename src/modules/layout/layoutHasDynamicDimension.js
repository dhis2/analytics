import { layoutGetAllDimensions } from './layoutGetAllDimensions'
import { dimensionGetId } from './dimensionGetId'
import { getFixedDimensions } from '../fixedDimensions'

export const layoutHasDynamicDimension = layout => {
    const fixedIds = Object.keys(getFixedDimensions())

    return Boolean(
        layoutGetAllDimensions(layout).find(
            dimension => !fixedIds.includes(dimensionGetId(dimension))
        )
    )
}
