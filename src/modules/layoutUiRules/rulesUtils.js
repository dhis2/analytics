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

export const isDimensionLocked = (visType, dimensionId) =>
    getAllLockedDimIdsByVisType(visType).find(id => id === dimensionId)

export const isAxisFull = (visType, axisId, axisDimensionsCount) =>
    axisDimensionsCount === getAxisMaxNumberOfDimsByVisType(visType, axisId)

export const canDimensionBeAddedToAxis = (visType, layout, axisId) => {
    const axisIsFull = isAxisFull(visType, axisId, layout[axisId].length)
    const transferableDimension = getTransferableDimensionPerAxisByVisType(
        visType,
        axisId,
        layout
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
    layout
) => {
    const lockedDimsByVisType = getLockedDimsByVisType(visType)
    const lockedDimIdsByAxis = Object.keys(lockedDimsByVisType).filter(
        dimId => lockedDimsByVisType[dimId] === axisId
    )

    // return the last "transferable" dimension, this needs to be adjusted
    // if we allow a defined max limit > 1 and the DND wants to drop the new
    // dimension in a specific position
    return layout[axisId]
        .filter(dimId => !lockedDimIdsByAxis.includes(dimId))
        .pop()
}
