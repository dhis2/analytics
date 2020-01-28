import { layoutGetAllDimensions } from './layoutGetAllDimensions'
import { dimensionGetId } from './dimensionGetId'
import { getPredefinedDimensions } from '../predefinedDimensions'

export const layoutHasDynamicDimension = layout => {
    const fixedIds = Object.keys(getPredefinedDimensions())

    return Boolean(
        layoutGetAllDimensions(layout).find(
            dimension => !fixedIds.includes(dimensionGetId(dimension))
        )
    )
}
