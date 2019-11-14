import {
    getAvailableAxesByRules,
    getDisallowedDimsByRules,
} from './rulesHelper'
import { getRulesByVisType } from './rules'

export const getAvailableAxes = visType =>
    getAvailableAxesByRules(getRulesByVisType(visType))

export const getDisallowedDims = visType =>
    getDisallowedDimsByRules(getRulesByVisType(visType))
