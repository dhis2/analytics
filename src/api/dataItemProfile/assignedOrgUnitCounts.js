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
 * The source keys of profiles (getDataItemProfile results): the data sets and
 * programs whose assignment can be counted, as `[{ id, field }]`, `field`
 * being the org unit field that lists them (dataSets or programs). Program
 * indicators whose values can be at any org unit are left out.
 */
export const getDataItemProfileSourceKeys = (profiles = []) => [
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
 * The number of org units each data set or program (`sourceKeys`, from
 * getDataItemProfileSourceKeys) is assigned to, per level, across the hierarchy: one
 * count per source and level. `levels` are fetched when not given; `signal`
 * cancels the requests. Gives
 * `{ levels, assignedOrgUnitCounts: { [sourceId]: { [level]: count } },
 * requests }`.
 */
export const fetchAssignedOrgUnitCounts = async (
    engine,
    sourceKeys,
    { levels, signal } = {}
) => {
    const knownLevels =
        levels ?? readLevels(await engine.query(levelsQuery, { signal }))
    const queries = sourceKeys.flatMap((sourceKey) =>
        knownLevels.map(({ level }) => [
            [sourceKey.id, level],
            countQuery([`level:eq:${level}`, assignedTo(sourceKey)]),
        ])
    )
    const { responses, requests } = await queryAll(engine, queries, {
        signal,
    })
    const assignedOrgUnitCounts = Object.fromEntries(
        sourceKeys.map(({ id }) => [id, {}])
    )

    queries.forEach(([[sourceId, level]], i) => {
        const total = getTotal(responses[i])

        if (total) {
            assignedOrgUnitCounts[sourceId][level] = total
        }
    })

    return {
        levels: knownLevels,
        assignedOrgUnitCounts,
        requests,
    }
}
