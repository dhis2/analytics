import {
    getOrgUnitsToFetch,
    readOrgUnitSelection,
    resolveParents,
} from '../../modules/dataItemProfile/orgUnits/orgUnitSelection.js'
import { fetchAssignedOrgUnitCounts } from './assignedOrgUnitCounts.js'
import { isCounted, mergeCounts, recordCount } from './coverageCounts.js'
import {
    fetchGroupMembersByLevel,
    getGroupCountQueries,
} from './orgUnitGroupCounts.js'
import { countFromLists } from './orgUnitListCounts.js'
import {
    assignedTo,
    getAncestorIds,
    countQuery,
    getTotal,
    queryAll,
} from './orgUnitQueries.js'
import { fetchSelectionOrgUnits } from './selectionOrgUnits.js'

/* The counts of one org unit: per level a source is assigned at (at or
 * below the org unit), how many org units under it the source is assigned
 * to, and how many of its ancestors when the source is assigned higher
 * somewhere; with `withTotals`, how many org units each of those levels has
 * under it. */
const getOrgUnitQueries = (
    orgUnit,
    { sourceKeys, assignedOrgUnitCounts, withTotals }
) => {
    const under = `path:like:${orgUnit.id}`
    const ancestorIds = getAncestorIds(orgUnit)
    const assignedLevelsOf = ({ id }) =>
        Object.keys(assignedOrgUnitCounts[id] ?? {}).map(Number)
    const levelsUnder = (source) =>
        assignedLevelsOf(source).filter((level) => level >= orgUnit.level)
    const isAssignedHigher = (source) =>
        assignedLevelsOf(source).some((level) => level < orgUnit.level)
    const getAncestorsQuery = (source) => [
        [orgUnit.id, source.id, 'ancestors'],
        countQuery([`id:in:[${ancestorIds.join(',')}]`, assignedTo(source)]),
    ]

    return [
        ...(withTotals
            ? [...new Set(sourceKeys.flatMap(levelsUnder))].map((level) => [
                  [orgUnit.id, 'total', level],
                  countQuery([under, `level:eq:${level}`]),
              ])
            : []),
        ...sourceKeys.flatMap((source) =>
            levelsUnder(source).map((level) => [
                [orgUnit.id, source.id, level],
                countQuery([under, `level:eq:${level}`, assignedTo(source)]),
            ])
        ),
        ...sourceKeys
            .filter((source) => ancestorIds.length && isAssignedHigher(source))
            .map(getAncestorsQuery),
    ]
}

/* Under the only root, a source's org units are those across the hierarchy:
 * the counts already fetched answer it, with no ancestors */
const getSoleRootCounts = (
    countedOrgUnits,
    { rootIds, sourceKeys, assignedOrgUnitCounts }
) => {
    const counts = {}
    const isCountedRoot = countedOrgUnits.some(({ id }) => id === rootIds[0])

    if (rootIds.length === 1 && isCountedRoot) {
        sourceKeys.forEach(({ id }) =>
            Object.entries(assignedOrgUnitCounts[id] ?? {}).forEach(
                ([level, count]) =>
                    recordCount(counts, [rootIds[0], id, Number(level)], count)
            )
        )
    }

    return counts
}

// Above this many source counts, lists of each source's org units are cheaper
const LIST_THRESHOLD = 100

/* Counts the queries; above LIST_THRESHOLD source counts, from lists of each
 * source's org units, kept in `lists` for the next selection. Totals are
 * always server counts. */
const fetchCounts = async (
    engine,
    { queries, sourceKeys, groupIds, lists, signal }
) => {
    const counts = {}
    const totalQueries = queries.filter(([[, what]]) => what === 'total')
    const sourceQueries = queries.filter(([[, what]]) => what !== 'total')
    const useLists = sourceQueries.length > LIST_THRESHOLD
    const [fetched, listed] = await Promise.all([
        queryAll(engine, useLists ? totalQueries : queries, { signal }),
        useLists
            ? countFromLists(engine, {
                  sourceQueries,
                  sourceKeys,
                  groupIds,
                  lists,
                  signal,
              })
            : { totals: [], lists, requests: 0 },
    ])

    ;(useLists ? totalQueries : queries).forEach(([key], i) =>
        recordCount(counts, key, getTotal(fetched.responses[i]))
    )

    if (useLists) {
        sourceQueries.forEach(([key], i) =>
            recordCount(counts, key, listed.totals[i])
        )
    }

    return {
        counts,
        lists: listed.lists,
        requests: fetched.requests + listed.requests,
    }
}

const EMPTY_COVERAGE = {
    levels: [],
    orgUnits: {},
    rootIds: [],
    userOrgUnitIds: null,
    groups: {},
    assignedOrgUnitCounts: {},
    counts: {},
    lists: {},
    requests: 0,
}

// The org units whose counts a selection reads: its own, the user's, and the roots for a level alone
const getCountedOrgUnits = (
    orgUnitItems,
    { orgUnits, rootIds, userOrgUnitIds }
) => {
    const { orgUnitIds, needsRoots, needsUserOrgUnits } =
        getOrgUnitsToFetch(orgUnitItems)
    const ids = new Set([
        ...orgUnitIds,
        ...(needsUserOrgUnits ? userOrgUnitIds ?? [] : []),
        ...(needsRoots ? rootIds : []),
    ])

    return [...ids].map((id) => orgUnits[id]).filter(Boolean)
}

/**
 * Where data sets and programs (`sourceKeys`, getDataItemProfileSourceKeys)
 * are assigned, for an org unit selection (`orgUnits`, DV's org unit items).
 * Gives:
 * - `levels`, and `orgUnits` by id (the selection's, the roots, the user's),
 *   with `rootIds` and `userOrgUnitIds`;
 * - `groups`: each group's members per level;
 * - `assignedOrgUnitCounts`: each source's assigned org units per level,
 *   across the hierarchy (those given are reused);
 * - `counts`, by org unit id (and by getGroupCountsKey for groups): per level
 *   a source is assigned at, how many org units under it the source is
 *   assigned to, and how many of its ancestors; with `withAssignmentTotals`,
 *   also how many org units each level has under it (for "x of y" and
 *   PARTLY_ASSIGNED); for a group, its members under each parent;
 * - `lists`: the lists of org units counted from, for large selections;
 * - `requests`: how many requests were sent.
 * All metadata. Identical counts are sent once, in batches. Above
 * LIST_THRESHOLD source counts, one list per source of its org units (and
 * one per group of its members) answers them instead. `previous`, the
 * coverage of an earlier selection, gives what it already counted: its org
 * units, levels, groups, lists and counts, source by source. `signal`
 * cancels the requests. getDataItemProfileOrgUnitCompatibility reads the
 * result.
 */
export const fetchOrgUnitCoverage = async (
    engine,
    {
        sourceKeys = [],
        orgUnits: orgUnitItems = [],
        assignedOrgUnitCounts = {},
        withAssignmentTotals = false,
        previous,
        signal,
    }
) => {
    if (!orgUnitItems.length) {
        return {
            ...EMPTY_COVERAGE,
            ...previous,
            assignedOrgUnitCounts: {
                ...previous?.assignedOrgUnitCounts,
                ...assignedOrgUnitCounts,
            },
            requests: 0,
        }
    }

    const fetched = await fetchSelectionOrgUnits(engine, {
        orgUnitItems,
        previous,
        signal,
    })
    const { levels, orgUnits, rootIds } = fetched
    const knownCounts = {
        ...previous?.assignedOrgUnitCounts,
        ...assignedOrgUnitCounts,
    }
    const knownGroups = previous?.groups ?? {}
    const { groupIds } = getOrgUnitsToFetch(orgUnitItems)
    const [assigned, grouped] = await Promise.all([
        fetchAssignedOrgUnitCounts(
            engine,
            sourceKeys.filter(({ id }) => !knownCounts[id]),
            { levels, signal }
        ),
        fetchGroupMembersByLevel(engine, {
            groupIds: groupIds.filter((groupId) => !knownGroups[groupId]),
            levels,
            signal,
        }),
    ])
    const allAssignedOrgUnitCounts = {
        ...knownCounts,
        ...assigned.assignedOrgUnitCounts,
    }
    const groups = { ...knownGroups, ...grouped.groups }
    const context = {
        sourceKeys,
        assignedOrgUnitCounts: allAssignedOrgUnitCounts,
        withTotals: withAssignmentTotals,
    }
    const countedOrgUnits = getCountedOrgUnits(orgUnitItems, fetched)
    const known = mergeCounts(
        previous?.counts,
        getSoleRootCounts(countedOrgUnits, { ...context, rootIds })
    )
    const { parentItems } = readOrgUnitSelection(orgUnitItems)
    const queries = [
        ...countedOrgUnits.flatMap((orgUnit) =>
            getOrgUnitQueries(orgUnit, context)
        ),
        ...getGroupCountQueries({
            ...context,
            groups: Object.fromEntries(
                groupIds.map((groupId) => [groupId, groups[groupId]])
            ),
            parents: parentItems.length
                ? resolveParents(parentItems, fetched) ?? []
                : null,
            orgUnits,
        }),
    ].filter(([key]) => !isCounted(known, key))
    const counted = await fetchCounts(engine, {
        queries,
        sourceKeys,
        groupIds,
        lists: previous?.lists,
        signal,
    })

    return {
        levels,
        orgUnits,
        rootIds,
        userOrgUnitIds: fetched.userOrgUnitIds,
        groups,
        assignedOrgUnitCounts: allAssignedOrgUnitCounts,
        counts: mergeCounts(known, counted.counts),
        lists: counted.lists ?? {},
        requests:
            fetched.requests +
            assigned.requests +
            grouped.requests +
            counted.requests,
    }
}
