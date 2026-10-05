import {
    getOrgUnitsToFetch,
    readOrgUnitSelection,
    resolveParents,
} from '../../modules/dataItemProfile/orgUnits/orgUnitSelection.js'
import { fetchAssignedOrgUnitCounts } from './assignedOrgUnitCounts.js'
import {
    fetchGroupMembersByLevel,
    getGroupCountQueries,
} from './orgUnitGroupCounts.js'
import { createListCounter } from './orgUnitListCounts.js'
import {
    assignedTo,
    getAncestorIds,
    countQuery,
    getTotal,
    inGroup,
    levelsQuery,
    queryAll,
    readLevels,
} from './orgUnitQueries.js'

const ORG_UNIT_FIELDS = 'id,level,path,displayName'

const orgUnitsQuery = (filter) => ({
    resource: 'organisationUnits',
    params: { filter, fields: ORG_UNIT_FIELDS, paging: false },
})

const byId = (orgUnits = []) =>
    Object.fromEntries(
        orgUnits.map(({ id, level, path, displayName }) => [
            id,
            { id, level, path, name: displayName },
        ])
    )

// The org units, roots, user's org units and levels a selection needs, beyond those already known
const fetchOrgUnits = async (engine, { orgUnitItems, previous, signal }) => {
    const { orgUnitIds, needsRoots, needsUserOrgUnits } =
        getOrgUnitsToFetch(orgUnitItems)
    const known = previous?.orgUnits ?? {}
    const missingIds = orgUnitIds.filter((id) => !known[id])
    const fetchRoots = needsRoots && !previous?.rootIds?.length
    const fetchUser = needsUserOrgUnits && !previous?.userOrgUnitIds
    const query = {
        ...(!previous?.levels?.length && levelsQuery),
        ...(missingIds.length && {
            orgUnits: orgUnitsQuery(`id:in:[${missingIds.join(',')}]`),
        }),
        ...(fetchRoots && { roots: orgUnitsQuery('level:eq:1') }),
        ...(fetchUser && {
            me: {
                resource: 'me',
                params: {
                    fields: `organisationUnits[${ORG_UNIT_FIELDS}],dataViewOrganisationUnits[${ORG_UNIT_FIELDS}]`,
                },
            },
        }),
    }
    const response = Object.keys(query).length
        ? await engine.query(query, { signal })
        : {}
    // Analytics reads the user's data view org units when there are some
    const userOrgUnits = response.me?.dataViewOrganisationUnits?.length
        ? response.me.dataViewOrganisationUnits
        : response.me?.organisationUnits
    const getRootIds = () =>
        fetchRoots
            ? (response.roots?.organisationUnits ?? []).map(({ id }) => id)
            : previous?.rootIds ?? []
    const getUserOrgUnitIds = () =>
        fetchUser
            ? (userOrgUnits ?? []).map(({ id }) => id)
            : previous?.userOrgUnitIds ?? null

    return {
        levels: response.levels ? readLevels(response) : previous.levels,
        orgUnits: {
            ...known,
            ...byId(response.orgUnits?.organisationUnits),
            ...byId(response.roots?.organisationUnits),
            ...byId(userOrgUnits),
        },
        rootIds: needsRoots ? getRootIds() : [],
        userOrgUnitIds: needsUserOrgUnits ? getUserOrgUnitIds() : null,
        requests: Object.keys(query).length,
    }
}

/* The counts of one org unit: how many org units each level under it has,
 * how many of them each source is assigned to, and how many of its
 * ancestors. Only levels a source is assigned at somewhere are counted. */
const getOrgUnitQueries = (orgUnit, { sourceKeys, assignedOrgUnitCounts }) => {
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
        ...[...new Set(sourceKeys.flatMap(levelsUnder))].map((level) => [
            [orgUnit.id, 'total', level],
            countQuery([under, `level:eq:${level}`]),
        ]),
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

const recordCount = (counts, [countsKey, what, level], total) => {
    counts[countsKey] ??= { totals: {}, sources: {} }

    const counted = counts[countsKey]

    if (what === 'total') {
        counted.totals[level] = total
        return
    }

    counted.sources[what] ??= { byLevel: {}, ancestors: 0 }

    if (level === 'ancestors') {
        counted.sources[what].ancestors += total
    } else {
        counted.sources[what].byLevel[level] = total
    }
}

// Above this many source counts, lists of each source's org units are cheaper
const LIST_THRESHOLD = 100

const listQuery = (filter) => ({
    resource: 'organisationUnits',
    params: { filter, fields: 'path', paging: false },
})

const getPaths = (response) =>
    (response?.organisationUnits ?? []).map(({ path }) => path)

/* The source counts, answered from one list per source of the org units it
 * is assigned to, and one list per group of its members */
const countFromLists = async (
    engine,
    { sourceQueries, sourceKeys, groupIds, signal }
) => {
    const lists = [
        ...sourceKeys.map((sourceKey) => [
            ['source', sourceKey.id],
            listQuery(assignedTo(sourceKey)),
        ]),
        ...groupIds.map((groupId) => [
            ['group', groupId],
            listQuery(inGroup(groupId)),
        ]),
    ]
    const { responses, requests } = await queryAll(engine, lists, { signal })
    const pathsOf = (kind) =>
        Object.fromEntries(
            lists
                .map(([[listKind, id]], i) => [listKind, id, responses[i]])
                .filter(([listKind]) => listKind === kind)
                .map(([, id, response]) => [id, getPaths(response)])
        )
    const sourcePaths = pathsOf('source')
    const count = createListCounter(pathsOf('group'))
    const sourceFilterOf = (sourceId) =>
        assignedTo(sourceKeys.find(({ id }) => id === sourceId))

    return {
        totals: sourceQueries.map(([[, sourceId], query]) =>
            count(
                sourcePaths[sourceId],
                query.params.filter.filter(
                    (condition) => condition !== sourceFilterOf(sourceId)
                )
            )
        ),
        requests,
    }
}

const fetchCounts = async (
    engine,
    { queries, sourceKeys, groupIds, signal }
) => {
    const counts = {}
    const totalQueries = queries.filter(([[, what]]) => what === 'total')
    const sourceQueries = queries.filter(([[, what]]) => what !== 'total')
    const useLists = sourceQueries.length > LIST_THRESHOLD
    const fetched = await queryAll(engine, useLists ? totalQueries : queries, {
        signal,
    })
    const listed = useLists
        ? await countFromLists(engine, {
              sourceQueries,
              sourceKeys,
              groupIds,
              signal,
          })
        : { totals: [], requests: 0 }

    ;(useLists ? totalQueries : queries).forEach(([key], i) =>
        recordCount(counts, key, getTotal(fetched.responses[i]))
    )

    if (useLists) {
        sourceQueries.forEach(([key], i) =>
            recordCount(counts, key, listed.totals[i])
        )
    }

    return { counts, requests: fetched.requests + listed.requests }
}

const EMPTY_COVERAGE = {
    levels: [],
    orgUnits: {},
    rootIds: [],
    userOrgUnitIds: null,
    groups: {},
    assignedOrgUnitCounts: {},
    sourceIds: [],
    counts: {},
    requests: 0,
}

// The counts of the previous coverage that still hold: same sources, same org unit or group level
const getReusableCounts = (previous, sourceKeys) =>
    previous && sourceKeys.every(({ id }) => previous.sourceIds?.includes(id))
        ? previous.counts
        : {}

/**
 * Where data sets and programs (`sourceKeys`, getDataItemProfileSourceKeys) are assigned,
 * for an org unit selection (`orgUnits`, DV's org unit items). Gives:
 * - `levels`, and `orgUnits` by id (the selection's, the roots for a level
 *   alone, the user's), with `rootIds` and `userOrgUnitIds`;
 * - `groups`: each group's members per level;
 * - `assignedOrgUnitCounts`: each source's assigned org units per level,
 *   across the hierarchy (those given are reused);
 * - `counts`, by org unit id (and by getGroupCountsKey for groups): per level
 *   a source is assigned at, the number of org units and of those each
 *   source is assigned to, plus the ancestors each one is assigned to;
 * - `sourceIds`, and `requests`: how many requests were sent.
 * All metadata. Identical counts are sent once, in batches. Above
 * LIST_THRESHOLD source counts, one list per source of its org units (and
 * one per group of its members) answers them instead. `previous`, the
 * coverage of an earlier selection, gives what it already knows: its org
 * units, levels, groups, assigned counts, and its counts when the sources
 * are the same. `signal` cancels the requests.
 * getDataItemProfileOrgUnitCompatibility reads the result.
 */
export const fetchOrgUnitCoverage = async (
    engine,
    {
        sourceKeys = [],
        orgUnits: orgUnitItems = [],
        assignedOrgUnitCounts = {},
        previous,
        signal,
    }
) => {
    if (!orgUnitItems.length) {
        return {
            ...EMPTY_COVERAGE,
            levels: previous?.levels ?? [],
            assignedOrgUnitCounts,
            sourceIds: sourceKeys.map(({ id }) => id),
        }
    }

    const fetched = await fetchOrgUnits(engine, {
        orgUnitItems,
        previous,
        signal,
    })
    const { levels, orgUnits, rootIds, userOrgUnitIds } = fetched
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
    }
    const { parentItems } = readOrgUnitSelection(orgUnitItems)
    const reusable = getReusableCounts(previous, sourceKeys)
    const queries = [
        ...Object.values(orgUnits).flatMap((orgUnit) =>
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
    ].filter(([[countsKey]]) => !reusable[countsKey])
    const counted = await fetchCounts(engine, {
        queries,
        sourceKeys,
        groupIds,
        signal,
    })

    return {
        levels,
        orgUnits,
        rootIds,
        userOrgUnitIds,
        groups,
        assignedOrgUnitCounts: allAssignedOrgUnitCounts,
        sourceIds: sourceKeys.map(({ id }) => id),
        counts: { ...reusable, ...counted.counts },
        requests:
            fetched.requests +
            assigned.requests +
            grouped.requests +
            counted.requests,
    }
}
