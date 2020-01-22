import {
    getMaxNumberOfItemsPerAxisByVisType,
    getMaxNumberOfDimsPerAxisByVisType,
    getMinNumberOfDimsPerAxisByVisType,
    getLockedDimsByVisType,
} from './rules'

// Selectors

export { getAvailableAxesByVisType, getDisallowedDimsByVisType } from './rules'

export const getAxisMaxNumberOfItemsByVisType = (visType, axisId) =>
    getMaxNumberOfItemsPerAxisByVisType(visType)[axisId]

export const getAxisMaxNumberOfDimsByVisType = (visType, axisId) =>
    getMaxNumberOfDimsPerAxisByVisType(visType)[axisId]

export const getAxisMinNumberOfDimsByVisType = (visType, axisId) =>
    getMinNumberOfDimsPerAxisByVisType(visType)[axisId]

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

export const getAxisPerLockedDimByVisType = (visType, dimensionId) =>
    getLockedDimsByVisType(visType)[dimensionId]

export const getAllLockedDimIdsByVisType = visType =>
    Object.keys(getLockedDimsByVisType(visType))

export const isDimensionLocked = (visType, dimensionId) =>
    getAllLockedDimIdsByVisType(visType).find(id => id === dimensionId)

export const isAxisFull = (visType, axisId, axisDimensionsCount) =>
    axisDimensionsCount === getAxisMaxNumberOfDimsByVisType(visType, axisId)

export const canDimensionBeAddedToAxis = (visType, layout, axisId) => {
    const axisIsFull = isAxisFull(visType, axisId, layout[axisId].length)
    const dimensionIsLocked = isDimensionLocked(visType, layout[axisId][0])

    // 1 dimension allowed in axis
    // 1 dimension is already present and not locked
    // the dragged one can be added and will cause the old one to be moved to filters
    if (axisIsFull && !dimensionIsLocked) {
        return true
    } else if (!axisIsFull) {
        return true
    }

    return false
}
