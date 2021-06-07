import { getPredefinedDimensions } from '../predefinedDimensions'
import { dimensionGetId } from './dimensionGetId'
import { layoutGetAllDimensions } from './layoutGetAllDimensions'

export const layoutHasDynamicDimension = layout => {
    const fixedIds = Object.keys(getPredefinedDimensions())

    return Boolean(
        layoutGetAllDimensions(layout).find(
            dimension => !fixedIds.includes(dimensionGetId(dimension))
        )
    )
}
