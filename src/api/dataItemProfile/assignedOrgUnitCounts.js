import {
    canBeAtAnyOrgUnit,
    getAssignmentField,
    getSourceId,
} from '../../modules/dataItemProfile/sources.js'
import {
    assignedTo,
    countQuery,
    getTotal,
    levelsQuery,
    queryAll,
    readLevels,
} from './orgUnitQueries.js'

/**
 * The data sets and programs behind profiles (getDataItemProfile results)
 * whose assignment can be counted: `[{ id, field }]`, `field` being the org
 * unit field that lists them (dataSets or programs). Program indicators
 * whose values can be at any org unit are left out.
 */
export const getCountableSources = (profiles = []) => [
    ...new Map(
        profiles
            .flatMap((profile) => profile?.sources ?? [])
            .filter(
                (source) => getSourceId(source) && !canBeAtAnyOrgUnit(source)
            )
            .map((source) => [
                getSourceId(source),
                { id: getSourceId(source), field: getAssignmentField(source) },
            ])
    ).values(),
]

/**
 * The number of org units each data set or program (`sources`, from
 * getCountableSources) is assigned to, per level, across the hierarchy: one
 * count per source and level. `levels` are fetched when not given. Gives
 * `{ levels, assignedOrgUnitCounts: { [sourceId]: { [level]: count } },
 * requests }`.
 */
export const fetchAssignedOrgUnitCounts = async (engine, sources, levels) => {
    const knownLevels = levels ?? readLevels(await engine.query(levelsQuery))
    const queries = sources.flatMap((source) =>
        knownLevels.map(({ level }) => [
            [source.id, level],
            countQuery([`level:eq:${level}`, assignedTo(source)]),
        ])
    )
    const response = await queryAll(engine, queries)
    const assignedOrgUnitCounts = Object.fromEntries(
        sources.map(({ id }) => [id, {}])
    )

    queries.forEach(([[sourceId, level]], i) => {
        const total = getTotal(response[`count${i}`])

        if (total) {
            assignedOrgUnitCounts[sourceId][level] = total
        }
    })

    return {
        levels: knownLevels,
        assignedOrgUnitCounts,
        requests: queries.length,
    }
}
