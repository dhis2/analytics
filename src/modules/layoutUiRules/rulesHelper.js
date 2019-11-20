// availableAxes

export const getAvailableAxesByRules = rules => rules.availableAxes || []

// disallowedDims

export const getDisallowedDimsByRules = rules => rules.disallowedDims || []

// maxNumberOfItemsPerAxis

export const getMaxNumberOfItemsPerAxisByRules = (rules, axisId) =>
    (rules.maxNumberOfItemsPerAxis || {})[axisId] || null

// lockedDims

export const getLockedDimAxisByRules = (rules, dimensionId) =>
    (rules.lockedDims || {})[dimensionId] || []

export const getLockedDimsByRules = rules => rules.lockedDims || []
