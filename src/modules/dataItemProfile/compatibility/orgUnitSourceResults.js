import {
    COMPATIBILITY_FULL,
    COMPATIBILITY_NONE,
    COMPATIBILITY_PARTIAL,
    LEFT_OUT_REASONS,
    REASON_ANY_ORG_UNIT,
    REASON_ASSIGNED_AT_HIGHER_LEVEL,
    REASON_NOT_ASSIGNED,
    REASON_PARTLY_ASSIGNED,
    REASON_STOPPED_BY_AGGREGATION_LEVEL,
} from '../constants.js'
import { canBeAtAnyOrgUnit, getSourceId } from '../sources.js'
import { createResult, unionOfReasons } from './combineResults.js'

/* Org unit results carry `assignment`: how many org units at the deepest
 * level assigned are assigned ({ assigned, total, level }), or null */
export const withAssignment = (result, assignment = null) => ({
    ...result,
    assignment,
})

const getLevelsWithOrgUnits = (countsByLevel) =>
    Object.keys(countsByLevel)
        .map(Number)
        .filter((level) => countsByLevel[level] > 0)

/* Analytics nulls the levels up to each aggregation level for values from
 * org units below it (dhis2-core AggregationLevelsHelper): a value from
 * `assignedLevel` can't reach `requestedLevel` when an aggregation level lies
 * between them (requestedLevel ≤ L < assignedLevel; checked by the test tool
 * on 2.40 to 2.44) */
const isBlockedByAggregationLevel = (
    assignedLevel,
    requestedLevel,
    aggregationLevels
) =>
    aggregationLevels.some(
        (aggregationLevel) =>
            requestedLevel <= aggregationLevel &&
            aggregationLevel < assignedLevel
    )

const getNotReachingReason = ({
    byLevel,
    ancestors,
    assignedOrgUnitCounts,
    level,
}) => {
    const assignedAtThisLevelElsewhere = getLevelsWithOrgUnits(
        assignedOrgUnitCounts
    ).some((assignedLevel) => assignedLevel >= level)
    const assignedHigher =
        ancestors > 0 ||
        getLevelsWithOrgUnits(byLevel).some(
            (assignedLevel) => assignedLevel < level
        )

    return assignedHigher && !assignedAtThisLevelElsewhere
        ? REASON_ASSIGNED_AT_HIGHER_LEVEL
        : REASON_NOT_ASSIGNED
}

/* One data set or program at one requested level, from its assignment
 * counts. Values add up from lower levels, but are never split down, so a
 * source assigned only at higher levels can't fill the level asked. The
 * deepest level assigned says how much of the org unit it covers. */
const getSourceResult = ({
    sourceCounts,
    assignedOrgUnitCounts = {},
    aggregationLevels = [],
    totals,
    level,
}) => {
    const { byLevel = {}, ancestors = 0 } = sourceCounts ?? {}
    const assignedAtOrBelow = getLevelsWithOrgUnits(byLevel).filter(
        (assignedLevel) => assignedLevel >= level
    )
    const reaching = assignedAtOrBelow.filter(
        (assignedLevel) =>
            !isBlockedByAggregationLevel(
                assignedLevel,
                level,
                aggregationLevels
            )
    )

    if (assignedAtOrBelow.length && !reaching.length) {
        return withAssignment(
            createResult(COMPATIBILITY_NONE, [
                REASON_STOPPED_BY_AGGREGATION_LEVEL,
            ])
        )
    }

    if (!reaching.length) {
        return withAssignment(
            createResult(COMPATIBILITY_NONE, [
                getNotReachingReason({
                    byLevel,
                    ancestors,
                    assignedOrgUnitCounts,
                    level,
                }),
            ])
        )
    }

    const deepestLevel = Math.max(...reaching)
    const assignment = {
        assigned: byLevel[deepestLevel],
        total: totals[deepestLevel] ?? byLevel[deepestLevel],
        level: deepestLevel,
    }

    // Org units it isn't assigned to collect nothing: nothing is left out
    return withAssignment(
        createResult(
            COMPATIBILITY_FULL,
            assignment.assigned < assignment.total
                ? [REASON_PARTLY_ASSIGNED]
                : []
        ),
        assignment
    )
}

const AT_ANY_ORG_UNIT = withAssignment(
    createResult(COMPATIBILITY_FULL, [REASON_ANY_ORG_UNIT])
)

const isLeftOut = ({ reasons }) =>
    reasons.some((reason) => LEFT_OUT_REASONS.has(reason))

/* One operand over its sources. A source not assigned there leaves nothing
 * out; one whose values can't reach the level asked (assigned higher, or
 * stopped by aggregation levels) leaves them out, so with another that fills
 * the org unit, the value is partial. */
const combineSources = (bySource) => {
    const filling = bySource.filter(
        ({ status }) => status === COMPATIBILITY_FULL
    )
    const reasons = unionOfReasons(bySource)
    const leftOut = bySource.some(isLeftOut)

    if (!filling.length) {
        return withAssignment(
            createResult(
                COMPATIBILITY_NONE,
                leftOut
                    ? reasons.filter((reason) => LEFT_OUT_REASONS.has(reason))
                    : [REASON_NOT_ASSIGNED]
            )
        )
    }

    const bestAssignment = filling
        .map(({ assignment }) => assignment)
        .filter(Boolean)
        .sort((a, b) => b.assigned / b.total - a.assigned / a.total)[0]

    return withAssignment(
        createResult(
            leftOut ? COMPATIBILITY_PARTIAL : COMPATIBILITY_FULL,
            reasons.filter((reason) => reason !== REASON_NOT_ASSIGNED)
        ),
        bestAssignment
    )
}

/**
 * One operand ({ element, sources }, getItemOperands) at one requested level,
 * from the counts kept for it in the coverage, with the `level` asked and the
 * sources' `assignedOrgUnitCounts` across the hierarchy.
 */
export const getOperandResult = ({ element, sources }, counts) =>
    combineSources(
        sources.map((source) =>
            canBeAtAnyOrgUnit(source)
                ? AT_ANY_ORG_UNIT
                : getSourceResult({
                      sourceCounts: counts.sources?.[getSourceId(source)],
                      assignedOrgUnitCounts:
                          counts.assignedOrgUnitCounts?.[getSourceId(source)],
                      aggregationLevels: element?.aggregationLevels,
                      totals: counts.totals ?? {},
                      level: counts.level,
                  })
        )
    )
