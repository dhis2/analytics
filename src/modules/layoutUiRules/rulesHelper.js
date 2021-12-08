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

export const getAxisPerLockedDimByVisType = (visType, dimensionId) =>
    getLockedDimsByVisType(visType)[dimensionId]

export const getAllLockedDimIdsByVisType = (visType) =>
    Object.keys(getLockedDimsByVisType(visType))
