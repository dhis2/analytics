import {
    getOrgUnitsToFetch,
    readOrgUnitSelection,
} from '../../modules/dataItemProfile/orgUnits/orgUnitSelection.js'
import { fetchAssignedOrgUnitCounts } from './assignedOrgUnitCounts.js'
import {
    fetchGroupMembersByLevel,
    getGroupCountQueries,
} from './orgUnitGroupCounts.js'
import {
    assignedTo,
    countQuery,
    getTotal,
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

const getAncestorIds = ({ id, path }) =>
    path.split('/').filter((ancestorId) => ancestorId && ancestorId !== id)

// The org units, roots and user's org units a selection needs, with the levels
const fetchOrgUnits = async (engine, orgUnitItems) => {
    const { orgUnitIds, needsRoots, needsUserOrgUnits } =
        getOrgUnitsToFetch(orgUnitItems)
    const response = await engine.query({
        ...levelsQuery,
        ...(orgUnitIds.length && {
            orgUnits: orgUnitsQuery(`id:in:[${orgUnitIds.join(',')}]`),
        }),
        ...(needsRoots && { roots: orgUnitsQuery('level:eq:1') }),
        ...(needsUserOrgUnits && {
            me: {
                resource: 'me',
                params: {
                    fields: `organisationUnits[${ORG_UNIT_FIELDS}],dataViewOrganisationUnits[${ORG_UNIT_FIELDS}]`,
                },
            },
        }),
    })
    // Analytics reads the user's data view org units when there are some
    const userOrgUnits = response.me?.dataViewOrganisationUnits?.length
        ? response.me.dataViewOrganisationUnits
        : response.me?.organisationUnits

    return {
        levels: readLevels(response),
        orgUnits: {
            ...byId(response.orgUnits?.organisationUnits),
            ...byId(response.roots?.organisationUnits),
            ...byId(userOrgUnits),
        },
        rootIds: needsRoots
            ? (response.roots?.organisationUnits ?? []).map(({ id }) => id)
            : [],
        userOrgUnitIds: needsUserOrgUnits
            ? (userOrgUnits ?? []).map(({ id }) => id)
            : null,
    }
}

/* The counts of one org unit: how many org units each level under it has,
 * how many of them each source is assigned to, and how many of its
 * ancestors. Only levels a source is assigned at somewhere are counted. */
const getOrgUnitQueries = (orgUnit, { sources, assignedOrgUnitCounts }) => {
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
        ...[...new Set(sources.flatMap(levelsUnder))].map((level) => [
            [orgUnit.id, 'total', level],
            countQuery([under, `level:eq:${level}`]),
        ]),
        ...sources.flatMap((source) =>
            levelsUnder(source).map((level) => [
                [orgUnit.id, source.id, level],
                countQuery([under, `level:eq:${level}`, assignedTo(source)]),
            ])
        ),
        ...sources
            .filter((source) => ancestorIds.length && isAssignedHigher(source))
            .map(getAncestorsQuery),
    ]
}

const readCounts = (queries, response) => {
    const counts = {}

    queries.forEach(([[countsKey, what, level]], i) => {
        counts[countsKey] ??= { totals: {}, sources: {} }

        const counted = counts[countsKey]
        const total = getTotal(response[`count${i}`])

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
    })

    return counts
}

/**
 * Where data sets and programs (`sources`, getCountableSources) are assigned,
 * for an org unit selection (`orgUnits`, DV's org unit items). Gives:
 * - `levels`, and `orgUnits` by id (the selection's, the roots for a level
 *   alone, the user's), with `rootIds` and `userOrgUnitIds`;
 * - `groups`: each group's members per level;
 * - `assignedOrgUnitCounts`: each source's assigned org units per level,
 *   across the hierarchy (those given are reused);
 * - `counts`, by org unit id (and by getGroupCountsKey for groups): per level
 *   a source is assigned at, the number of org units and of those each
 *   source is assigned to, plus the ancestors each one is assigned to;
 * - `requests`: how many counts were sent.
 * All metadata; each round of requests goes out together.
 * getDataItemProfileOrgUnitCompatibility reads the result.
 */
export const fetchOrgUnitCoverage = async (
    engine,
    { sources = [], orgUnits: orgUnitItems = [], assignedOrgUnitCounts = {} }
) => {
    const { levels, orgUnits, rootIds, userOrgUnitIds } = await fetchOrgUnits(
        engine,
        orgUnitItems
    )
    const missing = sources.filter(({ id }) => !assignedOrgUnitCounts[id])
    const [assigned, grouped] = await Promise.all([
        fetchAssignedOrgUnitCounts(engine, missing, levels),
        fetchGroupMembersByLevel(
            engine,
            getOrgUnitsToFetch(orgUnitItems).groupIds,
            levels
        ),
    ])
    const allAssignedOrgUnitCounts = {
        ...assignedOrgUnitCounts,
        ...assigned.assignedOrgUnitCounts,
    }
    const context = { sources, assignedOrgUnitCounts: allAssignedOrgUnitCounts }
    const queries = [
        ...Object.values(orgUnits).flatMap((orgUnit) =>
            getOrgUnitQueries(orgUnit, context)
        ),
        ...getGroupCountQueries({
            ...context,
            groups: grouped.groups,
            parentOrgUnitIds:
                readOrgUnitSelection(orgUnitItems).parentOrgUnitIds,
            orgUnits,
        }),
    ]

    return {
        levels,
        orgUnits,
        rootIds,
        userOrgUnitIds,
        groups: grouped.groups,
        assignedOrgUnitCounts: allAssignedOrgUnitCounts,
        counts: readCounts(queries, await queryAll(engine, queries)),
        requests: assigned.requests + grouped.requests + queries.length,
    }
}
