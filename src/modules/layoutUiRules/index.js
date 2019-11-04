import { getAvailableAxesByRules } from './rulesHelper'
import { getRulesByLayoutType } from './rules'

export const getAvailableAxes = layoutType =>
    getAvailableAxesByRules(getRulesByLayoutType(layoutType))
