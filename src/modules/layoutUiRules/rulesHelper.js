import {
    getMaxNumberOfItemsPerAxisByVisType,
    getLockedDimsByVisType,
} from './rules'

// Selectors

export { getAvailableAxesByVisType, getDisallowedDimsByVisType } from './rules'

export const getAxisMaxNumberOfItemsByVisType = (visType, axisId) =>
    getMaxNumberOfItemsPerAxisByVisType(visType)[axisId]

export const hasAxisTooManyItemsByVisType = (
    visType,
    axisId,
    numberOfItems
) => {
    const maxNumberOfItemsPerAxis = getAxisMaxNumberOfItemsByVisType(
        visType,
        axisId
    )

    return maxNumberOfItemsPerAxis
        ? numberOfItems > maxNumberOfItemsPerAxis
        : false
}

export const getAxisPerLockedDimensionByVisType = (visType, dimensionId) =>
    getLockedDimsByVisType(visType)[dimensionId]

export const getAllLockedDimensionIdsByVisType = visType =>
    Object.keys(getLockedDimsByVisType(visType))
