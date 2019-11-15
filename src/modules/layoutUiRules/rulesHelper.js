// availableAxes

export const getAvailableAxesByRules = rules => rules.availableAxes || []

// disallowedDims

export const getDisallowedDimsByRules = rules => rules.disallowedDims || []

// maxNumberOfItemsPerAxis

export const getMaxNumberOfItemsPerAxisByRules = (rules, axisName) =>
    (rules.maxNumberOfItemsPerAxis || {})[axisName] || null
