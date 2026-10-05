import {
    COMPATIBILITY_NONE,
    COMPATIBILITY_PARTIAL,
    LEFT_OUT_REASONS,
    ORG_UNIT_ITEM_TYPE_GROUP,
    REASON_EMPTY_GROUP,
    REASON_NO_ORG_UNITS_AT_LEVEL,
    REASON_NOT_ASSIGNED,
    REASON_OPERAND_EMPTY,
    REASON_OPERAND_PARTIAL,
    REASON_PARTLY_ASSIGNED,
    REASON_PROFILE_UNKNOWN,
    REASON_UNKNOWN_ORG_UNIT,
} from '../constants.js'
import {
    getRequestedLevels,
    readOrgUnitSelection,
} from '../orgUnits/orgUnitSelection.js'
import { getItemOperands } from '../sources.js'
import {
    combineExpressionResults,
    createResult,
    getMostSevere,
    getUnknownResult,
    unionOfReasons,
} from './combineResults.js'
import { getOperandResult, withAssignment } from './orgUnitSourceResults.js'

/* The org units of all requested levels add up: only those that are
 * assigned count, and the assignment adds up over all of them (an org unit
 * with nothing assigned adds its org units to the total) */
const addUpAssignments = (judged) => {
    const assignments = judged
        .map(({ result }) => result.assignment)
        .filter(Boolean)

    if (!assignments.length) {
        return null
    }

    const level = Math.max(...assignments.map((assignment) => assignment.level))
    const assigned = assignments.reduce((sum, item) => sum + item.assigned, 0)
    const total = judged.reduce(
        (sum, { result, counts }) =>
            sum + (result.assignment?.total ?? counts.totals?.[level] ?? 0),
        0
    )

    return { assigned, total, level }
}

/* Where an operand has no value, the values of the others are dropped: they
 * are left out, unlike values of an org unit nothing is assigned to */
const DROPPED_BY_OPERAND_REASONS = new Set([
    REASON_OPERAND_EMPTY,
    REASON_OPERAND_PARTIAL,
])

const leavesValuesOut = ({ status, reasons }) =>
    status === COMPATIBILITY_PARTIAL ||
    reasons.some(
        (reason) =>
            LEFT_OUT_REASONS.has(reason) ||
            DROPPED_BY_OPERAND_REASONS.has(reason)
    )

/* A level under several parents, or a group with members at several levels:
 * the values of all add up. Where nothing is assigned, nothing is left out,
 * only fewer org units are assigned (PARTLY_ASSIGNED); where values can't
 * reach the level asked, or an operand has none, they are left out
 * (partial). */
const combineRequestedLevels = (judged) => {
    const results = judged.map(({ result }) => result)
    const reasons = unionOfReasons(results)

    if (results.every(({ status }) => status === COMPATIBILITY_NONE)) {
        return withAssignment(createResult(COMPATIBILITY_NONE, reasons))
    }

    const assignment = addUpAssignments(judged)
    const status = results.some(leavesValuesOut)
        ? COMPATIBILITY_PARTIAL
        : getMostSevere(
              results.filter(({ status }) => status !== COMPATIBILITY_NONE)
          ).status
    const isPartlyAssigned =
        assignment && assignment.assigned < assignment.total

    return withAssignment(
        createResult(
            status,
            unionOfReasons([
                {
                    reasons: reasons.filter(
                        (reason) =>
                            reason !== REASON_NOT_ASSIGNED &&
                            reason !== REASON_PARTLY_ASSIGNED
                    ),
                },
                { reasons: isPartlyAssigned ? [REASON_PARTLY_ASSIGNED] : [] },
            ])
        ),
        assignment
    )
}

/* The item at one requested level: each operand over its sources, combined
 * as its expression says; the assignment of the most severe operand */
const getResultAtLevel = ({ expression, operands }, counts) => {
    const results = new Map(
        operands.map((operand) => [
            operand.key,
            getOperandResult(operand, counts),
        ])
    )

    return withAssignment(
        combineExpressionResults(expression, [...results.keys()], (key) =>
            results.get(key)
        ),
        getMostSevere([...results.values()])?.assignment
    )
}

const isEmptyGroup = (selectionItem, coverage) =>
    selectionItem.type === ORG_UNIT_ITEM_TYPE_GROUP &&
    coverage.groups?.[selectionItem.groupId] &&
    !Object.values(coverage.groups[selectionItem.groupId]).some(
        (members) => members > 0
    )

const getSelectionItemCompatibility = (
    selectionItem,
    { item, parentItems, coverage }
) => {
    if (isEmptyGroup(selectionItem, coverage)) {
        return withAssignment(
            createResult(COMPATIBILITY_NONE, [REASON_EMPTY_GROUP])
        )
    }

    const requestedLevels = getRequestedLevels(
        selectionItem,
        parentItems,
        coverage
    )

    if (!requestedLevels) {
        return withAssignment(getUnknownResult(REASON_UNKNOWN_ORG_UNIT))
    }

    const judged = requestedLevels
        // Parents a group has no member under add nothing
        .filter(
            ({ groupId, countsKey, level }) =>
                !groupId || coverage.counts[countsKey]?.totals?.[level] > 0
        )
        .map(({ countsKey, level }) => {
            const counts = { ...coverage.counts[countsKey], level }

            return { counts, result: getResultAtLevel(item, counts) }
        })

    if (!judged.length) {
        return withAssignment(
            createResult(COMPATIBILITY_NONE, [REASON_NO_ORG_UNITS_AT_LEVEL])
        )
    }

    return judged.length === 1
        ? judged[0].result
        : combineRequestedLevels(judged)
}

/**
 * Whether the org units of a selection (DV's org unit items) suit a data
 * item, from where its data sets and programs are assigned (`coverage`, from
 * fetchOrgUnitCoverage): one result per selection item, `{ id, status,
 * reasons, assignment }`, with the same statuses as for periods.
 *
 * Assigned only at higher levels: none, ASSIGNED_AT_HIGHER_LEVEL. Not
 * assigned there: none, NOT_ASSIGNED. Stopped by the element's aggregation
 * levels: none, STOPPED_BY_AGGREGATION_LEVEL. Assigned to only some org units
 * at the deepest level: full, since nothing is left out, with
 * PARTLY_ASSIGNED and the counts (`assignment`). An element in several data
 * sets is full where one is assigned, and partial when another's values can't
 * reach the org unit. A group is judged at each level its members are at; a
 * group without members is refused by analytics (EMPTY_GROUP). An item with
 * no source (an expression of constants) has nothing limiting where it has
 * values: full.
 */
export const getDataItemProfileOrgUnitCompatibility = (
    profile,
    { orgUnits = [] } = {},
    { orgUnitCoverage: coverage } = {}
) => {
    const { selectionItems, parentItems } = readOrgUnitSelection(orgUnits)
    const judge = (getResult) =>
        selectionItems.map((selectionItem) => ({
            id: selectionItem.id,
            ...getResult(selectionItem),
        }))

    if (profile.unknown) {
        return judge(() =>
            withAssignment(getUnknownResult(REASON_PROFILE_UNKNOWN))
        )
    }

    if (!coverage) {
        return judge(() =>
            withAssignment(getUnknownResult(REASON_UNKNOWN_ORG_UNIT))
        )
    }

    const item = {
        expression: profile.expression,
        operands: getItemOperands(profile),
    }

    return judge((selectionItem) =>
        getSelectionItemCompatibility(selectionItem, {
            item,
            parentItems,
            coverage,
        })
    )
}
