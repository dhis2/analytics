export const getAvailableAxes = layoutType =>
    getAvailableAxesByRules(getRulesByLayoutType(layoutType))
