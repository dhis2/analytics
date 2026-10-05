/* Counts answered from lists instead of the server: for a large selection,
 * one list of the org units each source is assigned to (with their paths)
 * and one of each group's members replace hundreds of pageSize=1 counts. The
 * filters of a count are evaluated on the list as the server would. */

const getPathIds = (path) => path.split('/').filter(Boolean)

const GROUP_FILTER = /^((?:parent\.|children\.)*)organisationUnitGroups\.id$/

// For a group: its members' ids, and the ids of the org units `height` levels above a member
const indexGroup = (memberPaths) => {
    const members = memberPaths.map(getPathIds)
    const aboveMembers = (height) =>
        new Set(
            members
                .filter((ids) => ids.length > height)
                .map((ids) => ids.at(-1 - height))
        )
    const aboveByHeight = new Map()

    return {
        memberIds: new Set(members.map((ids) => ids.at(-1))),
        isAboveMembers: (id, height) => {
            if (!aboveByHeight.has(height)) {
                aboveByHeight.set(height, aboveMembers(height))
            }

            return aboveByHeight.get(height).has(id)
        },
    }
}

// Whether the org unit of `ids` (its path) passes a group filter behind parent. and children. steps
const passesGroupFilter = (ids, steps, group) => {
    const parents = (steps.match(/parent\./g) ?? []).length
    const children = (steps.match(/children\./g) ?? []).length

    if (children) {
        return group.isAboveMembers(ids.at(-1), children)
    }

    const ancestor = ids.at(-1 - parents)

    return Boolean(ancestor) && group.memberIds.has(ancestor)
}

const passesFilter = (ids, condition, groups) => {
    const [field, operator, ...rest] = condition.split(':')
    const value = rest.join(':')
    const groupSteps = field.match(GROUP_FILTER)

    if (groupSteps) {
        return passesGroupFilter(ids, groupSteps[1], groups[value])
    }

    switch (`${field}:${operator}`) {
        case 'level:eq':
            return ids.length === Number(value)
        case 'path:like':
            return ids.includes(value)
        case 'id:in':
            return value.slice(1, -1).split(',').includes(ids.at(-1))
        default:
            return false
    }
}

/**
 * The count of `filter` (a count query's filters, without the source one)
 * among the org units of a source (`paths`), with the members of the groups
 * the filters name (`groupMemberPaths`, by group id).
 */
export const createListCounter = (groupMemberPaths) => {
    const groups = Object.fromEntries(
        Object.entries(groupMemberPaths).map(([groupId, paths]) => [
            groupId,
            indexGroup(paths),
        ])
    )

    return (paths, filter) =>
        paths
            .map(getPathIds)
            .filter((ids) =>
                filter.every((condition) =>
                    passesFilter(ids, condition, groups)
                )
            ).length
}
