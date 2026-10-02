import {
    COMPATIBILITY_NONE,
    ORG_UNIT_ITEM_TYPE_GROUP,
    REASON_EMPTY_GROUP,
    REASON_NOT_ASSIGNED,
    REASON_PROFILE_UNKNOWN,
    REASON_UNKNOWN_ORG_UNIT,
} from '../constants.js'
import {
    getRequestedLevels,
    readOrgUnitSelection,
} from '../orgUnits/orgUnitSelection.js'
import { getItemOperands } from '../sources.js'
import {
    combineOperandResults,
    createResult,
    getMostSevere,
    getUnknownResult,
    unionOfReasons,
} from './combineResults.js'
import { getOperandResult, withAssignment } from './orgUnitSourceResults.js'

const addUpAssignments = (results) => {
    const assignments = results
        .map(({ assignment }) => assignment)
        .filter(Boolean)
    const sum = (key) =>
        assignments.reduce((total, item) => total + item[key], 0)

    return assignments.length
        ? {
              assigned: sum('assigned'),
              total: sum('total'),
              level: Math.max(...assignments.map(({ level }) => level)),
          }
        : null
}

// The item at one requested level: each operand over its sources, the most severe decides
const getResultAtLevel = (operands, counts) => {
    const results = operands.map((operand) => getOperandResult(operand, counts))

    return withAssignment(
        combineOperandResults(results),
        getMostSevere(results)?.assignment
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
    { operands, parentOrgUnitIds, coverage }
) => {
    if (isEmptyGroup(selectionItem, coverage)) {
        return withAssignment(
            createResult(COMPATIBILITY_NONE, [REASON_EMPTY_GROUP])
        )
    }

    const requestedLevels = getRequestedLevels(
        selectionItem,
        parentOrgUnitIds,
        coverage
    )

    if (!requestedLevels) {
        return withAssignment(getUnknownResult(REASON_UNKNOWN_ORG_UNIT))
    }

    const results = requestedLevels
        // Parents a group has no member under add nothing
        .filter(
            ({ groupId, countsKey, level }) =>
                !groupId || coverage.counts[countsKey]?.totals?.[level] > 0
        )
        .map(({ countsKey, level }) =>
            getResultAtLevel(operands, {
                ...coverage.counts[countsKey],
                assignedOrgUnitCounts: coverage.assignedOrgUnitCounts,
                level,
            })
        )

    if (!results.length) {
        return withAssignment(
            createResult(COMPATIBILITY_NONE, [REASON_NOT_ASSIGNED])
        )
    }

    return withAssignment(
        createResult(getMostSevere(results).status, unionOfReasons(results)),
        addUpAssignments(results)
    )
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
 * at the deepest level: full, since the others collect nothing, with
 * PARTLY_ASSIGNED and the counts (`assignment`). An element in several data
 * sets is full where one is assigned, and partial when another's values can't
 * reach the org unit. A group is judged at each level its members are at; a
 * group without members is refused by analytics (EMPTY_GROUP). An item with
 * no source (an expression of constants) has nothing limiting where it has
 * values: full.
 */
export const getDataItemProfileOrgUnitCompatibility = (
    profile,
    { orgUnits = [], coverage } = {}
) => {
    const { selectionItems, parentOrgUnitIds } = readOrgUnitSelection(orgUnits)
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

    const operands = getItemOperands(profile)

    return judge((selectionItem) =>
        getSelectionItemCompatibility(selectionItem, {
            operands,
            parentOrgUnitIds,
            coverage,
        })
    )
}
