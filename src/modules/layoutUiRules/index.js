import {
    getAvailableAxesByRules,
    getDisallowedDimsByRules,
    getMaxNumberOfItemsPerAxisByRules,
    getLockedDimAxisByRules,
    getLockedDimsByRules,
} from './rulesHelper'
import { getRulesByVisType } from './rules'

// availableAxes
// returns: array
export const getAvailableAxes = visType =>
    getAvailableAxesByRules(getRulesByVisType(visType))

// disallowedDims
// returns: array
export const getDisallowedDims = visType =>
    getDisallowedDimsByRules(getRulesByVisType(visType))

// maxNumberOfItemsPerAxis
// returns: number || null
export const getMaxNumberOfItemsPerAxis = (visType, axisId) => {
    return getMaxNumberOfItemsPerAxisByRules(getRulesByVisType(visType), axisId)
}

// returns: boolean
export const hasTooManyItemsPerAxis = (visType, axisId, numberOfItems) => {
    const maxNumberOfItemsPerAxis = getMaxNumberOfItemsPerAxis(visType, axisId)

    return maxNumberOfItemsPerAxis
        ? numberOfItems > maxNumberOfItemsPerAxis
        : false
}

// lockedDims
// returns: array
export const getLockedDimensionAxis = (visType, dimensionId) =>
    getLockedDimAxisByRules(getRulesByVisType(visType), dimensionId)

export const getLockedDims = visType =>
    Object.keys(getLockedDimsByRules(getRulesByVisType(visType)))
