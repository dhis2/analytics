import { layoutGetAllDimensions } from './layoutGetAllDimensions'

export const layoutHasDynamicDimension = layout =>
    layoutGetAllDimensions(layout).find(
        dimension => !FIXED_DIMENSION_IDS.includes(dimensionGetId(dimension))
    )
