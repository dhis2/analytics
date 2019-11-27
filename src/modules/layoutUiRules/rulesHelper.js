import {
    getAvailableAxesByRules,
    getDisallowedDimsByRules,
    getMaxNumberOfItemsPerAxisByRules,
    getLockedDimsByRules,
    defaultRules,
    pieRules,
    yearOverYearRules,
    singleValueRules,
} from './rules'
import {
    VIS_TYPE_COLUMN,
    VIS_TYPE_STACKED_COLUMN,
    VIS_TYPE_BAR,
    VIS_TYPE_STACKED_BAR,
    VIS_TYPE_LINE,
    VIS_TYPE_AREA,
    VIS_TYPE_RADAR,
    VIS_TYPE_GAUGE,
    VIS_TYPE_PIE,
    VIS_TYPE_SINGLE_VALUE,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_PIVOT_TABLE,
} from '../visTypes'

const visTypeToRules = {
    [VIS_TYPE_COLUMN]: defaultRules,
    [VIS_TYPE_STACKED_COLUMN]: defaultRules,
    [VIS_TYPE_BAR]: defaultRules,
    [VIS_TYPE_STACKED_BAR]: defaultRules,
    [VIS_TYPE_LINE]: defaultRules,
    [VIS_TYPE_AREA]: defaultRules,
    [VIS_TYPE_RADAR]: defaultRules,
    [VIS_TYPE_GAUGE]: singleValueRules,
    [VIS_TYPE_PIE]: pieRules,
    [VIS_TYPE_SINGLE_VALUE]: singleValueRules,
    [VIS_TYPE_YEAR_OVER_YEAR_LINE]: yearOverYearRules,
    [VIS_TYPE_YEAR_OVER_YEAR_COLUMN]: yearOverYearRules,
    [VIS_TYPE_PIVOT_TABLE]: defaultRules,
}

const getRulesByVisType = visType => {
    const rules = visTypeToRules[visType]

    if (!rules) {
        throw new Error(`${visType} is not a known visualization type`)
    }

    return rules
}

// Selectors

export const getAvailableAxesByVisType = visType =>
    getAvailableAxesByRules(getRulesByVisType(visType))

export const getDisallowedDimensionsByVisType = visType =>
    getDisallowedDimsByRules(getRulesByVisType(visType))

export const getMaxNumberOfItemsPerAxisByVisType = (visType, axisId) =>
    getMaxNumberOfItemsPerAxisByRules(getRulesByVisType(visType))[axisId]

export const hasTooManyItemsPerAxisByVisType = (
    visType,
    axisId,
    numberOfItems
) => {
    const maxNumberOfItemsPerAxis = getMaxNumberOfItemsPerAxisByVisType(
        visType,
        axisId
    )

    return maxNumberOfItemsPerAxis
        ? numberOfItems > maxNumberOfItemsPerAxis
        : false
}

export const getLockedDimensionAxisByVisType = (visType, dimensionId) =>
    getLockedDimsByRules(getRulesByVisType(visType))[dimensionId]

export const getLockedDimensionsByVisType = visType =>
    Object.keys(getLockedDimsByRules(getRulesByVisType(visType)))

// Test resources

export const testResourceRules = Object.values(visTypeToRules)
