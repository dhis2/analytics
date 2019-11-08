import { getAvailableAxesByRules } from './rulesHelper'
import { getRulesByVisType } from './rules'

export const getAvailableAxes = visType =>
    getAvailableAxesByRules(getRulesByVisType(visType))
