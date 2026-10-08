import {
    COMPATIBILITY_FULL,
    COMPATIBILITY_NONE,
    REASON_NOT_ASSIGNED,
    REASON_UNKNOWN_ORG_UNIT,
} from '../constants.js'
import { readOrgUnitSelection } from '../orgUnits/orgUnitSelection.js'
import { getItemOperands } from '../sources.js'
import {
    combineAddedUpResults,
    combineExpressionResults,
    createResult,
    getUnknownResult,
    unionOfReasons,
} from './combineResults.js'
import { getSelectionItemLevels } from './getDataItemProfileOrgUnitCompatibility.js'
import {
    getPeriodQueries,
    getSelectionYears,
    judgePeriodQueries,
} from './getDataItemProfilePeriodCompatibility.js'
import {
    getOperandSourceResults as getOrgUnitSourceResults,
    isNotAssigned,
} from './orgUnitSourceResults.js'
import { getOperandSourceResults as getPeriodSourceResults } from './periodSourceResults.js'

/* A period at an org unit: only the sources assigned there count, each
 * judged for the period. A monthly data set at district A and a weekly one
 * at B give nothing by week at A, and every value by week at B, which the
 * period and the org unit judged apart can't tell. */

const NOT_ASSIGNED = createResult(COMPATIBILITY_NONE, [REASON_NOT_ASSIGNED])

/* One source of an operand: not assigned there, it doesn't apply; its values
 * can't reach the level asked, they are left out; otherwise, the period
 * decides */
const getSourceResult = (orgUnitResult, periodResult) => {
    if (isNotAssigned(orgUnitResult)) {
        return null
    }

    if (orgUnitResult.status !== COMPATIBILITY_FULL) {
        return createResult(orgUnitResult.status, orgUnitResult.reasons)
    }

    return createResult(
        periodResult.status,
        unionOfReasons([orgUnitResult, periodResult])
    )
}

// One operand, for one period query, at one requested level: its sources there add up
const getOperandResult = (operand, { query, counts }) => {
    const periodResults = getPeriodSourceResults(operand, query)
    const results = getOrgUnitSourceResults(operand, counts)
        .map((orgUnitResult, i) =>
            getSourceResult(orgUnitResult, periodResults[i])
        )
        .filter(Boolean)

    return results.length ? combineAddedUpResults(results) : NOT_ASSIGNED
}

const getItemResult = ({ expression, operands }, at) => {
    const results = new Map(
        operands.map((operand) => [operand.key, getOperandResult(operand, at)])
    )

    return combineExpressionResults(expression, [...results.keys()], (key) =>
        results.get(key)
    )
}

// Under several parents, or at several member levels, the org units where it applies add up
const combineLevels = (results) => {
    const applying = results.filter((result) => !isNotAssigned(result))

    return applying.length ? combineAddedUpResults(applying) : NOT_ASSIGNED
}

const judgeSelectionItem = (
    item,
    { queries, selectionItem, parentItems, coverage }
) => {
    if (!coverage) {
        return getUnknownResult(REASON_UNKNOWN_ORG_UNIT)
    }

    const { result, levels } = getSelectionItemLevels(selectionItem, {
        parentItems,
        coverage,
    })

    if (result) {
        return createResult(result.status, result.reasons)
    }

    return judgePeriodQueries(queries, (query) =>
        combineLevels(
            levels.map((counts) => getItemResult(item, { query, counts }))
        )
    )
}

/**
 * Each period of a selection at each of its org unit selection items,
 * judged together (`{ periodId, orgUnitId, status, reasons }`), with the
 * options of getDataItemProfileCompatibility. Where a data set isn't
 * assigned, its period type doesn't count.
 */
export const getPeriodAtOrgUnitResults = (
    profile,
    { periods = [], orgUnits = [] } = {},
    { orgUnitCoverage: coverage, ...options } = {}
) => {
    const selectionYears = getSelectionYears(periods, options)
    const { selectionItems, parentItems } = readOrgUnitSelection(orgUnits)
    const item = {
        expression: profile.expression,
        operands: getItemOperands(profile),
    }

    return periods.flatMap((period) => {
        const { queries, unknownReason } = getPeriodQueries(profile, period, {
            ...options,
            selectionYears,
        })

        return selectionItems.map((selectionItem) => ({
            periodId: period,
            orgUnitId: selectionItem.id,
            ...(unknownReason
                ? getUnknownResult(unknownReason)
                : judgeSelectionItem(item, {
                      queries,
                      selectionItem,
                      parentItems,
                      coverage,
                  })),
        }))
    })
}
