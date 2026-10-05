import { getGroupCountsKey } from '../../modules/dataItemProfile/orgUnits/orgUnitSelection.js'
import {
    assignedTo,
    getAncestorIds,
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
export const fetchGroupMembersByLevel = async (
    engine,
    { groupIds, levels, signal }
) => {
    const queries = groupIds.flatMap((groupId) =>
        levels.map(({ level }) => [
            [groupId, level],
            countQuery([inGroup(groupId), `level:eq:${level}`]),
        ])
    )
    const { responses, requests } = await queryAll(engine, queries, {
        signal,
    })
    const groups = Object.fromEntries(groupIds.map((groupId) => [groupId, {}]))

    queries.forEach(([[groupId, level]], i) => {
        const total = getTotal(responses[i])

        if (total) {
            groups[groupId][level] = total
        }
    })

    return { groups, requests }
}

const NO_PARENT = { orgUnitId: null, minLevel: 1 }

/* Each level a group's members are at, under each parent that holds that
 * level (resolveParents), or anywhere without parents */
const getGroupLevelsUnderParents = ({ groups, parents }) =>
    Object.entries(groups).flatMap(([groupId, membersByLevel]) =>
        Object.keys(membersByLevel)
            .map(Number)
            .flatMap((memberLevel) =>
                (parents ?? [NO_PARENT])
                    .filter(({ minLevel }) => minLevel <= memberLevel)
                    .map(({ orgUnitId }) => ({
                        groupId,
                        memberLevel,
                        parentId: orgUnitId,
                    }))
            )
    )

/* The org units above the members at `level`, kept under the parent: below
 * the parent's level, the parent's own ancestors */
const getAboveMembersFilters = (
    { groupId, memberLevel, parentId },
    level,
    orgUnits
) => {
    const parent = parentId && orgUnits[parentId]

    if (parent && level < parent.level) {
        return [`id:in:[${getAncestorIds(parent).join(',')}]`]
    }

    return [
        ...(parent ? [`path:like:${parentId}`] : []),
        aboveMembers(groupId, memberLevel - level),
    ]
}

/* The counts of one group level under one parent, as for an org unit: the
 * org units at each level under the members (the members' level included, to
 * know whether any lie under the parent), those each source is assigned to,
 * and the ones above the members each source is assigned to */
const getGroupLevelQueries = (
    groupLevel,
    { sourceKeys, assignedOrgUnitCounts, orgUnits }
) => {
    const { groupId, memberLevel, parentId } = groupLevel
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
        ...sourceKeys.flatMap(levelsOf).filter((level) => level >= memberLevel),
    ])
    const getSourceQuery = (sourceKey, level) =>
        level >= memberLevel
            ? [
                  [key, sourceKey.id, level],
                  countQuery([...atLevel(level), assignedTo(sourceKey)]),
              ]
            : [
                  [key, sourceKey.id, 'ancestors'],
                  countQuery([
                      ...getAboveMembersFilters(groupLevel, level, orgUnits),
                      `level:eq:${level}`,
                      assignedTo(sourceKey),
                  ]),
              ]

    return [
        ...[...totalLevels].map((level) => [
            [key, 'total', level],
            countQuery(atLevel(level)),
        ]),
        ...sourceKeys.flatMap((sourceKey) =>
            levelsOf(sourceKey).map((level) => getSourceQuery(sourceKey, level))
        ),
    ]
}

/**
 * The count queries for groups (`groups`, from fetchGroupMembersByLevel),
 * under the selection's parents (`parents`, from resolveParents; null for
 * none), kept by getGroupCountsKey, in the shape fetchOrgUnitCoverage reads.
 */
export const getGroupCountQueries = ({
    groups,
    parents,
    orgUnits,
    sourceKeys,
    assignedOrgUnitCounts,
}) =>
    getGroupLevelsUnderParents({ groups, parents }).flatMap((groupLevel) =>
        getGroupLevelQueries(groupLevel, {
            sourceKeys,
            assignedOrgUnitCounts,
            orgUnits,
        })
    )
