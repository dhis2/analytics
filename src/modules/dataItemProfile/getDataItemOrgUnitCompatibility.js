import {
    COMPATIBILITY_FULL,
    COMPATIBILITY_NONE,
    COMPATIBILITY_PARTIAL,
    COMPATIBILITY_UNKNOWN,
    OPERAND_REASONS,
    REASON_PROFILE_UNKNOWN,
    withOperandReason,
} from './compatibilityStatuses.js'
import { getOrgUnitTargets, readOrgUnitSelection } from './orgUnitSelection.js'
import { getSourceId, isPlacedAnywhere, isProgramSource } from './sources.js'

// No data from some or all of the places
export const REASON_NOT_ASSIGNED = 'NOT_ASSIGNED'
export const REASON_BELOW_COLLECTION = 'BELOW_COLLECTION'
export const REASON_AGGREGATION_LEVEL = 'AGGREGATION_LEVEL'
// Full, but placed by another org unit than the program's: anywhere
export const REASON_ORG_UNIT_FIELD = 'ORG_UNIT_FIELD'
// Full, but collected at only some of the units
export const REASON_PARTLY_ASSIGNED = 'PARTLY_ASSIGNED'
// Can't be told
export const REASON_UNKNOWN_ORG_UNIT = 'UNKNOWN_ORG_UNIT'
export const REASON_EVENT_DATA = 'EVENT_DATA'

export const ORG_UNIT_REASON_ORDER = [
    ...OPERAND_REASONS,
    REASON_NOT_ASSIGNED,
    REASON_BELOW_COLLECTION,
    REASON_AGGREGATION_LEVEL,
    REASON_PARTLY_ASSIGNED,
    REASON_ORG_UNIT_FIELD,
    REASON_UNKNOWN_ORG_UNIT,
    REASON_EVENT_DATA,
]

// Most severe first: an expression needs all its operands
const SEVERITY = [
    COMPATIBILITY_NONE,
    COMPATIBILITY_PARTIAL,
    COMPATIBILITY_UNKNOWN,
    COMPATIBILITY_FULL,
]

const unionOfReasons = (results) =>
    ORG_UNIT_REASON_ORDER.filter((reason) =>
        results.some(({ reasons }) => reasons.includes(reason))
    )

const pickBy = (order, results) =>
    order
        .map((status) => results.find((result) => result.status === status))
        .find(Boolean)

const sumCoverage = (results) => {
    const coverages = results.map(({ coverage }) => coverage).filter(Boolean)

    return coverages.length
        ? {
              assigned: coverages.reduce(
                  (sum, { assigned }) => sum + assigned,
                  0
              ),
              total: coverages.reduce((sum, { total }) => sum + total, 0),
              level: Math.max(...coverages.map(({ level }) => level)),
          }
        : null
}

/* Analytics nulls the levels up to each aggregation level for values entered
 * below it (AggregationLevelsHelper): a value entered at `entryLevel` can't
 * reach `level` when an aggregation level lies between them */
const isStopped = (entryLevel, level, aggregationLevels) =>
    aggregationLevels.some(
        (aggregationLevel) =>
            level <= aggregationLevel && aggregationLevel < entryLevel
    )

/* One data set at one target (a unit, and the level asked under it), from
 * its assignment counts: where data can be entered. Nothing is split down to
 * lower levels, so data entered above the level asked can't fill it; below,
 * it adds up, and the deepest level assigned says how much of the place it
 * covers. A data set entered at the level asked elsewhere, but not here:
 * NOT_ASSIGNED. Only above it: BELOW_COLLECTION. */
const judgeDataSet = ({
    dataSetCounts,
    assignedLevels = {},
    aggregationLevels = [],
    totals,
    level,
}) => {
    const { byLevel = {}, ancestors = 0 } = dataSetCounts ?? {}
    const levelsWith = (counts) =>
        Object.keys(counts)
            .map(Number)
            .filter((assignedLevel) => counts[assignedLevel] > 0)
    const assignedHere = levelsWith(byLevel).filter(
        (assignedLevel) => assignedLevel >= level
    )
    const entryLevels = assignedHere.filter(
        (entryLevel) => !isStopped(entryLevel, level, aggregationLevels)
    )

    if (assignedHere.length && !entryLevels.length) {
        return {
            status: COMPATIBILITY_NONE,
            reasons: [REASON_AGGREGATION_LEVEL],
            coverage: null,
        }
    }

    if (!entryLevels.length) {
        const enteredHereElsewhere = levelsWith(assignedLevels).some(
            (assignedLevel) => assignedLevel >= level
        )
        const enteredAbove =
            ancestors > 0 ||
            levelsWith(byLevel).some((assignedLevel) => assignedLevel < level)

        return {
            status: COMPATIBILITY_NONE,
            reasons: [
                enteredAbove && !enteredHereElsewhere
                    ? REASON_BELOW_COLLECTION
                    : REASON_NOT_ASSIGNED,
            ],
            coverage: null,
        }
    }

    const deepest = Math.max(...entryLevels)
    const coverage = {
        assigned: byLevel[deepest],
        total: totals[deepest] ?? byLevel[deepest],
        level: deepest,
    }

    // Units it isn't assigned to don't collect it: nothing is left out
    return {
        status: COMPATIBILITY_FULL,
        reasons:
            coverage.assigned < coverage.total ? [REASON_PARTLY_ASSIGNED] : [],
        coverage,
    }
}

// A program indicator placing values by another org unit fits any place
const PLACED_ANYWHERE = {
    status: COMPATIBILITY_FULL,
    reasons: [REASON_ORG_UNIT_FIELD],
    coverage: null,
}

// Values that exist but can't reach the level asked
const LEFT_OUT_REASONS = [REASON_BELOW_COLLECTION, REASON_AGGREGATION_LEVEL]

const isLeftOut = ({ reasons }) =>
    reasons.some((reason) => LEFT_OUT_REASONS.includes(reason))

/* An element over its data sets. One not assigned there leaves nothing out;
 * one whose values can't reach the level asked (entered above, or stopped by
 * aggregation levels) leaves them out, so with another that fills the place,
 * the value is partial. */
const combineDataSets = (bySource) => {
    const filling = bySource.filter(
        ({ status }) => status === COMPATIBILITY_FULL
    )
    const reasons = unionOfReasons(bySource)
    const leftOut = bySource.some(isLeftOut)

    if (!filling.length) {
        return {
            status: COMPATIBILITY_NONE,
            reasons: leftOut
                ? reasons.filter((reason) => LEFT_OUT_REASONS.includes(reason))
                : [REASON_NOT_ASSIGNED],
            coverage: null,
        }
    }

    return {
        status: leftOut ? COMPATIBILITY_PARTIAL : COMPATIBILITY_FULL,
        reasons: reasons.filter((reason) => reason !== REASON_NOT_ASSIGNED),
        coverage: filling
            .map(({ coverage }) => coverage)
            .sort((a, b) => b.assigned / b.total - a.assigned / a.total)[0],
    }
}

/* The item's operands: each element over its data sets (where any of them
 * is assigned), with its aggregation levels, each reporting rate (where its
 * data set is), and each program (where it is assigned). */
const getOperands = (profile) => {
    const elements = new Map()

    profile.sources.forEach(({ elements: sourceElements }) =>
        sourceElements.forEach((element) => elements.set(element.id, element))
    )

    return [
        ...[...elements.values()].map(({ id, aggregationLevels }) => ({
            sources: profile.sources.filter(({ elements: sourceElements }) =>
                sourceElements.some((element) => element.id === id)
            ),
            aggregationLevels,
        })),
        ...profile.sources
            .filter((source) => source.reportingRate || isProgramSource(source))
            .map((source) => ({ sources: [source] })),
    ]
}

const judgeTarget = (operands, counts) => {
    const results = operands.map(({ sources, aggregationLevels }) => {
        const bySource = sources.map((source) =>
            isPlacedAnywhere(source)
                ? PLACED_ANYWHERE
                : judgeDataSet({
                      dataSetCounts: counts.sources?.[getSourceId(source)],
                      assignedLevels:
                          counts.assignedLevels?.[getSourceId(source)],
                      aggregationLevels,
                      totals: counts.totals ?? {},
                      level: counts.level,
                  })
        )
        return combineDataSets(bySource)
    })
    const worst = pickBy(SEVERITY, results)

    return (
        worst && {
            ...withOperandReason(
                { ...worst, reasons: unionOfReasons(results) },
                operands.length
            ),
            coverage: worst.coverage,
        }
    )
}

const unknownResult = (id, reason) => ({
    id,
    status: COMPATIBILITY_UNKNOWN,
    reasons: [reason],
    coverage: null,
})

const judgeItem = (item, { operands, boundaries, coverage }) => {
    const targets = getOrgUnitTargets(item, boundaries, coverage)

    if (!targets) {
        return unknownResult(item.id, REASON_UNKNOWN_ORG_UNIT)
    }

    const countsOf = ({ key, unitId }) => coverage.counts[key ?? unitId]
    // Boundaries a group has no member under add nothing
    const results = targets
        .filter(
            (target) =>
                !target.group || countsOf(target)?.totals?.[target.level] > 0
        )
        .map((target) =>
            judgeTarget(operands, {
                ...countsOf(target),
                assignedLevels: coverage.assignedLevels,
                level: target.level,
            })
        )
    const worst = pickBy(SEVERITY, results)

    return {
        id: item.id,
        status: worst?.status ?? COMPATIBILITY_NONE,
        reasons: worst ? unionOfReasons(results) : [REASON_NOT_ASSIGNED],
        coverage: sumCoverage(results),
    }
}

/**
 * Whether the places of an org unit selection suit the item, from where its
 * data sets are assigned (fetchOrgUnitCoverage): one result per item of the
 * selection, with the same statuses as for periods. Data entered above the
 * level asked: none, BELOW_COLLECTION. Not assigned there: none,
 * NOT_ASSIGNED. Stopped by the element's aggregation levels: none,
 * AGGREGATION_LEVEL. Assigned to only some of the units at the deepest level
 * entered: full, since the others don't collect it, with PARTLY_ASSIGNED and
 * the counts (`coverage`).
 *
 * An element over several data sets is fully compatible where one is
 * assigned, and partially when another's values can't reach the place: they
 * are left out. A group is judged at each level its members are at, as the
 * units under them add up. Event data and unknown units can't be told.
 */
export const getDataItemOrgUnitCompatibility = (
    profile,
    orgUnits = [],
    coverage
) => {
    const { items, boundaries } = readOrgUnitSelection(orgUnits)

    if (profile.unknown) {
        return items.map(({ id }) => unknownResult(id, REASON_PROFILE_UNKNOWN))
    }

    if (!profile.sources.length) {
        return items.map(({ id }) => unknownResult(id, REASON_EVENT_DATA))
    }

    if (!coverage) {
        return items.map(({ id }) => unknownResult(id, REASON_UNKNOWN_ORG_UNIT))
    }

    return items.map((item) =>
        judgeItem(item, {
            operands: getOperands(profile),
            boundaries,
            coverage,
        })
    )
}
