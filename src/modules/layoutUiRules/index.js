import {
    getAvailableAxesByRules,
    getDisallowedDimsByRules,
    getMaxNumberOfItemsPerAxisByRules,
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
export const getMaxNumberOfItemsPerAxis = (visType, axisName) => {
    return getMaxNumberOfItemsPerAxisByRules(
        getRulesByVisType(visType),
        axisName
    )
}

// returns: boolean
export const hasTooManyItemsPerAxis = (visType, axisName, numberOfItems) => {
    const maxNumberOfItemsPerAxis = getMaxNumberOfItemsPerAxis(
        visType,
        axisName
    )

    return maxNumberOfItemsPerAxis
        ? numberOfItems > maxNumberOfItemsPerAxis
        : false
}

// lockedDims
// returns: array
export const getLockedDimensionAxis = (visType, dimensionId) =>
    getLockedDimAxisByRules(getRulesByVisType(visType), dimensionId)
