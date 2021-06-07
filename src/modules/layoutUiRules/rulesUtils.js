import { getLockedDimsByVisType } from './rules'
import {
    getAxisMaxNumberOfDimsByVisType,
    getAxisMaxNumberOfItemsByVisType,
    getAllLockedDimIdsByVisType,
} from './rulesHelper'

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

export const isDimensionLockedByVisType = (visType, dimensionId) =>
    getAllLockedDimIdsByVisType(visType).includes(dimensionId)

export const isAxisFullByVisType = (visType, axisId, axisDimensionsCount) =>
    axisDimensionsCount >= getAxisMaxNumberOfDimsByVisType(visType, axisId)

export const canDimensionBeAddedToAxisByVisType = (visType, axis, axisId) => {
    const axisIsFull = isAxisFullByVisType(visType, axisId, axis.length)
    const transferableDimension = getTransferableDimensionPerAxisByVisType(
        visType,
        axisId,
        axis
    )

    // 1 dimension allowed in axis
    // 1 dimension is already present and not locked
    // the dragged one can be added and will cause the old one to be moved to filters
    // what happens with max limit > 1, axis full and 1 or more locked dimensions?
    return !(axisIsFull && !transferableDimension)
}

export const getTransferableDimensionPerAxisByVisType = (
    visType,
    axisId,
    axis
) => {
    const lockedDimsByVisType = getLockedDimsByVisType(visType)
    const lockedDimIdsByAxis = Object.keys(lockedDimsByVisType).filter(
        dimId => lockedDimsByVisType[dimId] === axisId
    )

    // return the last "transferable" dimension, this needs to be adjusted
    // if we allow a defined max limit > 1 and the DND wants to drop the new
    // dimension in a specific position
    return axis.filter(dimId => !lockedDimIdsByAxis.includes(dimId)).pop()
}
