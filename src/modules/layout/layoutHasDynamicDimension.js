import { getPredefinedDimensions } from '../predefinedDimensions.js'
import { dimensionGetId } from './dimensionGetId.js'
import { layoutGetAllDimensions } from './layoutGetAllDimensions.js'

export const layoutHasDynamicDimension = layout => {
    const fixedIds = Object.keys(getPredefinedDimensions())

    return Boolean(
        layoutGetAllDimensions(layout).find(
            dimension => !fixedIds.includes(dimensionGetId(dimension))
        )
    )
}
