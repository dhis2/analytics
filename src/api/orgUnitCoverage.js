import {
    getUnitsToCount,
    readOrgUnitSelection,
} from '../modules/dataItemProfile/orgUnitSelection.js'
import {
    getSourceField,
    getSourceId,
    isPlacedAnywhere,
} from '../modules/dataItemProfile/sources.js'
import { fetchGroupLevels, getGroupCountQueries } from './orgUnitGroupCounts.js'
import { assignedTo, countQuery, getTotal, queryAll } from './orgUnitQueries.js'

const UNIT_FIELDS = 'id,level,path,displayName'

const unitsQuery = (filter) => ({
    resource: 'organisationUnits',
    params: { filter, fields: UNIT_FIELDS, paging: false },
})

const byId = (units = []) =>
    Object.fromEntries(
        units.map(({ id, level, path, displayName }) => [
            id,
            { id, level, path, name: displayName },
        ])
    )

const getAncestorIds = ({ id, path }) =>
    path.split('/').filter((ancestorId) => ancestorId && ancestorId !== id)

/**
 * The data sets and programs behind profiles (getDataItemProfile results),
 * whose assignment fetchOrgUnitCoverage counts: `[{ id, field }]`, `field`
 * being the org unit field that lists them (dataSets or programs).
 */
export const getProfilesSources = (profiles = []) => [
    ...new Map(
        profiles
            .flatMap((profile) => profile?.sources ?? [])
            .filter(
                (source) => getSourceId(source) && !isPlacedAnywhere(source)
            )
            .map((source) => [
                getSourceId(source),
                { id: getSourceId(source), field: getSourceField(source) },
            ])
    ).values(),
]

// The units, roots and user's units a selection needs, with the levels
const fetchUnits = async (engine, orgUnits) => {
    const { unitIds, needsRoots, needsUser } = getUnitsToCount(orgUnits)
    const response = await engine.query({
        ...levelsQuery,
        ...(unitIds.length && {
            units: unitsQuery(`id:in:[${unitIds.join(',')}]`),
        }),
        ...(needsRoots && { roots: unitsQuery('level:eq:1') }),
        ...(needsUser && {
            me: {
                resource: 'me',
                params: {
                    fields: `organisationUnits[${UNIT_FIELDS}],dataViewOrganisationUnits[${UNIT_FIELDS}]`,
                },
            },
        }),
    })
    // Analytics reads the user's data view units when there are some
    const userUnits = response.me?.dataViewOrganisationUnits?.length
        ? response.me.dataViewOrganisationUnits
        : response.me?.organisationUnits
    const levels = readLevels(response)

    return {
        levels,
        units: {
            ...byId(response.units?.organisationUnits),
            ...byId(response.roots?.organisationUnits),
            ...byId(userUnits),
        },
        roots: needsRoots
            ? (response.roots?.organisationUnits ?? []).map(({ id }) => id)
            : [],
        userUnits: needsUser ? (userUnits ?? []).map(({ id }) => id) : null,
    }
}

// Each source's assigned units per level, across the whole hierarchy
const getAssignedLevelQueries = (sources, levels) =>
    sources.flatMap((source) =>
        levels.map(({ level }) => [
            [source.id, level],
            countQuery([`level:eq:${level}`, assignedTo(source)]),
        ])
    )

const readAssignedLevels = (sources, queries, response) => {
    const bySource = Object.fromEntries(sources.map(({ id }) => [id, {}]))

    queries.forEach(([[sourceId, level]], i) => {
        const byLevel = bySource[sourceId]
        const total = getTotal(response[`count${i}`])

        if (total) {
            byLevel[level] = total
        }
    })

    return bySource
}

const levelsQuery = {
    levels: {
        resource: 'organisationUnitLevels',
        params: { fields: 'id,level,displayName', paging: false },
    },
}

const readLevels = (response) =>
    (response?.levels?.organisationUnitLevels ?? [])
        .map(({ id, level, displayName }) => ({ id, level, name: displayName }))
        .sort((a, b) => a.level - b.level)

/**
 * Each source's assigned units per level, across the hierarchy, as counts
 * (pageSize=1): where its data is entered. `sources` are `[{ id, field }]`
 * (getProfilesSources), `levels` are fetched when not given. Gives
 * `{ levels, assignedLevels: { [sourceId]: { [level]: count } }, requests }`;
 * getDataItemProfile reads `assignedLevels` for the profile's org unit side.
 */
export const fetchSourceOrgUnitLevels = async (engine, sources, levels) => {
    const knownLevels = levels ?? readLevels(await engine.query(levelsQuery))
    const queries = getAssignedLevelQueries(sources, knownLevels)

    return {
        levels: knownLevels,
        assignedLevels: readAssignedLevels(
            sources,
            queries,
            await queryAll(engine, queries)
        ),
        requests: queries.length,
    }
}

/* For each unit: how many units each level under it has, how many of them
 * each source is assigned to, and how many of its ancestors. Only levels a
 * source is assigned at somewhere are counted. */
const getCountQueries = (units, sources, assignedLevels) =>
    Object.values(units).flatMap((unit) => {
        const under = `path:like:${unit.id}`
        const ancestorIds = getAncestorIds(unit)
        const levelsOf = ({ id }) =>
            Object.keys(assignedLevels[id] ?? {})
                .map(Number)
                .filter((level) => level >= unit.level)
        const isAssignedAbove = ({ id }) =>
            Object.keys(assignedLevels[id] ?? {}).some(
                (level) => Number(level) < unit.level
            )
        const totalLevels = [...new Set(sources.flatMap(levelsOf))]

        return [
            ...totalLevels.map((level) => [
                [unit.id, 'total', level],
                countQuery([under, `level:eq:${level}`]),
            ]),
            ...sources.flatMap((source) => [
                ...levelsOf(source).map((level) => [
                    [unit.id, source.id, level],
                    countQuery([
                        under,
                        `level:eq:${level}`,
                        assignedTo(source),
                    ]),
                ]),
                ...(ancestorIds.length && isAssignedAbove(source)
                    ? [
                          [
                              [unit.id, source.id, 'ancestors'],
                              countQuery([
                                  `id:in:[${ancestorIds.join(',')}]`,
                                  assignedTo(source),
                              ]),
                          ],
                      ]
                    : []),
            ]),
        ]
    })

const readCounts = (queries, response) => {
    const counts = {}

    queries.forEach(([[unitId, what, level]], i) => {
        const unit =
            counts[unitId] || (counts[unitId] = { totals: {}, sources: {} })
        const total = getTotal(response[`count${i}`])

        if (what === 'total') {
            unit.totals[level] = total
            return
        }

        const source =
            unit.sources[what] ||
            (unit.sources[what] = { byLevel: {}, ancestors: 0 })

        if (level === 'ancestors') {
            source.ancestors += total
        } else {
            source.byLevel[level] = total
        }
    })

    return counts
}

/**
 * Where data sets and programs (`sources`, getProfilesSources) are assigned,
 * under the units of an org unit selection (DV's org unit items): the
 * levels, the units (boundaries, roots for a level alone, the user's units),
 * each group's members per level (`groups`), each source's `assignedLevels`
 * across the hierarchy, and for each unit (and group, by getGroupCountsKey), per
 * level below it that a source is assigned at, the number of units and of
 * units each source is assigned to, plus its ancestors each one is assigned
 * to. Only counts are fetched
 * (pageSize=1), so large hierarchies cost the same; each round of requests
 * goes out together. getDataItemOrgUnitCompatibility reads the result.
 */
export const fetchOrgUnitCoverage = async (
    engine,
    { sources = [], orgUnits = [], assignedLevels: known = {} }
) => {
    const { levels, units, roots, userUnits } = await fetchUnits(
        engine,
        orgUnits
    )
    const missing = sources.filter(({ id }) => !known[id])
    const [counted, grouped] = await Promise.all([
        fetchSourceOrgUnitLevels(engine, missing, levels),
        fetchGroupLevels(engine, getUnitsToCount(orgUnits).groupIds, levels),
    ])
    const assignedLevels = { ...known, ...counted.assignedLevels }
    const queries = [
        ...getCountQueries(units, sources, assignedLevels),
        ...getGroupCountQueries({
            groups: grouped.groups,
            boundaries: readOrgUnitSelection(orgUnits).boundaries,
            units,
            sources,
            assignedLevels,
        }),
    ]

    return {
        levels,
        units,
        roots,
        userUnits,
        groups: grouped.groups,
        assignedLevels,
        counts: readCounts(queries, await queryAll(engine, queries)),
        requests: counted.requests + grouped.requests + queries.length,
    }
}
