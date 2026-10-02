import { getGroupCountsKey } from '../../modules/dataItemProfile/orgUnits/orgUnitSelection.js'
import {
    assignedTo,
    countQuery,
    getTotal,
    inGroup,
    queryAll,
} from './orgUnitQueries.js'

/* Org units `depth` levels below a group's members (parent.parent…), or
 * `height` levels above them (children.children…). ancestors.* doesn't
 * filter; these work on 2.40 to 2.44 (checked by the test tool). */
const belowMembers = (groupId, depth) =>
    'parent.'.repeat(depth) + inGroup(groupId)
const aboveMembers = (groupId, height) =>
    'children.'.repeat(height) + inGroup(groupId)

/**
 * Each group's members per level: `{ groups: { [groupId]: { [level]: count } },
 * requests }`.
 */
export const fetchGroupMembersByLevel = async (engine, groupIds, levels) => {
    const queries = groupIds.flatMap((groupId) =>
        levels.map(({ level }) => [
            [groupId, level],
            countQuery([inGroup(groupId), `level:eq:${level}`]),
        ])
    )
    const response = await queryAll(engine, queries)
    const groups = Object.fromEntries(groupIds.map((groupId) => [groupId, {}]))

    queries.forEach(([[groupId, level]], i) => {
        const total = getTotal(response[`count${i}`])

        if (total) {
            groups[groupId][level] = total
        }
    })

    return { groups, requests: queries.length }
}

/* Each place to count a group in: the level its members are at, under each
 * parent org unit at or above it (or none) */
const getGroupPlaces = ({ groups, parentOrgUnitIds, orgUnits }) => {
    const parents = parentOrgUnitIds.length ? parentOrgUnitIds : [null]

    return Object.entries(groups).flatMap(([groupId, membersByLevel]) =>
        Object.keys(membersByLevel)
            .map(Number)
            .flatMap((memberLevel) =>
                parents
                    .filter(
                        (parentId) =>
                            !parentId ||
                            orgUnits[parentId]?.level <= memberLevel
                    )
                    .map((parentId) => ({ groupId, memberLevel, parentId }))
            )
    )
}

/* The counts of one place, as for an org unit: the org units at each level
 * under the members (the members' level included, to know whether any lie
 * under the parent), those each source is assigned to, and the ones above
 * the members each source is assigned to (above any member: the filter can't
 * keep them under the parent, and they only tell ASSIGNED_AT_HIGHER_LEVEL
 * from NOT_ASSIGNED) */
const getPlaceQueries = (
    { groupId, memberLevel, parentId },
    { sources, assignedOrgUnitCounts }
) => {
    const key = getGroupCountsKey(groupId, memberLevel, parentId)
    const underParent = parentId ? [`path:like:${parentId}`] : []
    const levelsOf = ({ id }) =>
        Object.keys(assignedOrgUnitCounts[id] ?? {}).map(Number)
    const atLevel = (level) => [
        ...underParent,
        belowMembers(groupId, level - memberLevel),
        `level:eq:${level}`,
    ]
    const totalLevels = new Set([
        memberLevel,
        ...sources.flatMap(levelsOf).filter((level) => level >= memberLevel),
    ])
    const getSourceQuery = (source, level) =>
        level >= memberLevel
            ? [
                  [key, source.id, level],
                  countQuery([...atLevel(level), assignedTo(source)]),
              ]
            : [
                  [key, source.id, 'ancestors'],
                  countQuery([
                      aboveMembers(groupId, memberLevel - level),
                      `level:eq:${level}`,
                      assignedTo(source),
                  ]),
              ]

    return [
        ...[...totalLevels].map((level) => [
            [key, 'total', level],
            countQuery(atLevel(level)),
        ]),
        ...sources.flatMap((source) =>
            levelsOf(source).map((level) => getSourceQuery(source, level))
        ),
    ]
}

/**
 * The count queries for groups (`groups`, from fetchGroupMembersByLevel),
 * kept by getGroupCountsKey, in the shape fetchOrgUnitCoverage reads.
 */
export const getGroupCountQueries = ({
    groups,
    parentOrgUnitIds,
    orgUnits,
    sources,
    assignedOrgUnitCounts,
}) =>
    getGroupPlaces({ groups, parentOrgUnitIds, orgUnits }).flatMap((place) =>
        getPlaceQueries(place, { sources, assignedOrgUnitCounts })
    )
