import { getGroupCountsKey } from '../modules/dataItemProfile/orgUnitSelection.js'
import { assignedTo, countQuery, getTotal, queryAll } from './orgUnitQueries.js'

const inGroup = (group) => `organisationUnitGroups.id:eq:${group}`

/* Units `depth` levels under a group's members (parent.parent…), or above
 * them (children.children…) */
const underMembers = (group, depth) => 'parent.'.repeat(depth) + inGroup(group)
const aboveMembers = (group, height) =>
    'children.'.repeat(height) + inGroup(group)

/**
 * Each group's members per level, as counts: `{ [group]: { [level]: count } }`.
 */
export const fetchGroupLevels = async (engine, groupIds, levels) => {
    const queries = groupIds.flatMap((group) =>
        levels.map(({ level }) => [
            [group, level],
            countQuery([inGroup(group), `level:eq:${level}`]),
        ])
    )
    const response = await queryAll(engine, queries)
    const groups = Object.fromEntries(groupIds.map((group) => [group, {}]))

    queries.forEach(([[group, level]], i) => {
        const total = getTotal(response[`count${i}`])

        if (total) {
            groups[group][level] = total
        }
    })

    return { groups, requests: queries.length }
}

/* For each group, level its members are at, and boundary (or none), the same
 * counts as for a unit: the units at each level under the members (the
 * members' level included, to know whether any lie in the boundary), those
 * each source is assigned to, and the units above the members each source is
 * assigned to (above any member: the filter can't keep them to the
 * boundary, and they only tell BELOW_COLLECTION from NOT_ASSIGNED). */
export const getGroupCountQueries = ({
    groups,
    boundaries,
    units,
    sources,
    assignedLevels,
}) =>
    Object.entries(groups).flatMap(([group, memberLevels]) =>
        Object.keys(memberLevels)
            .map(Number)
            .flatMap((memberLevel) =>
                (boundaries.length ? boundaries : [null])
                    .filter(
                        (unitId) =>
                            !unitId ||
                            (units[unitId] &&
                                units[unitId].level <= memberLevel)
                    )
                    .flatMap((unitId) => {
                        const key = getGroupCountsKey(
                            group,
                            memberLevel,
                            unitId
                        )
                        const within = unitId ? [`path:like:${unitId}`] : []
                        const levelsOf = ({ id }) =>
                            Object.keys(assignedLevels[id] ?? {}).map(Number)
                        const under = (level) => [
                            ...within,
                            underMembers(group, level - memberLevel),
                            `level:eq:${level}`,
                        ]
                        const totalLevels = [
                            ...new Set([
                                memberLevel,
                                ...sources
                                    .flatMap(levelsOf)
                                    .filter((level) => level >= memberLevel),
                            ]),
                        ]

                        return [
                            ...totalLevels.map((level) => [
                                [key, 'total', level],
                                countQuery(under(level)),
                            ]),
                            ...sources.flatMap((source) =>
                                levelsOf(source).map((level) =>
                                    level >= memberLevel
                                        ? [
                                              [key, source.id, level],
                                              countQuery([
                                                  ...under(level),
                                                  assignedTo(source),
                                              ]),
                                          ]
                                        : [
                                              [key, source.id, 'ancestors'],
                                              countQuery([
                                                  aboveMembers(
                                                      group,
                                                      memberLevel - level
                                                  ),
                                                  `level:eq:${level}`,
                                                  assignedTo(source),
                                              ]),
                                          ]
                                )
                            ),
                        ]
                    })
            )
    )
