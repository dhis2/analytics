import {
    ouIdHelper,
    USER_ORG_UNIT,
    USER_ORG_UNIT_CHILDREN,
    USER_ORG_UNIT_GRANDCHILDREN,
} from '../../ouIdHelper/index.js'
import {
    ORG_UNIT_ITEM_TYPE_GROUP,
    ORG_UNIT_ITEM_TYPE_LEVEL,
    ORG_UNIT_ITEM_TYPE_ORG_UNIT,
    ORG_UNIT_ITEM_TYPE_UNKNOWN,
    ORG_UNIT_ITEM_TYPE_USER,
} from '../constants.js'

/* An org unit selection is DV's org unit items: org unit ids, LEVEL-n (a
 * number or a level id), OU_GROUP-id, and the user's org units
 * (USER_ORGUNIT, its children or grandchildren). A selection item is one of
 * them, not a data item. */

// How many levels below the user's org units each user item reaches
const USER_ITEM_DEPTHS = new Map([
    [USER_ORG_UNIT, 0],
    [USER_ORG_UNIT_CHILDREN, 1],
    [USER_ORG_UNIT_GRANDCHILDREN, 2],
])

const UID = /^[a-zA-Z][a-zA-Z0-9]{10}$/

export const parseOrgUnitSelectionItem = (id) => {
    if (USER_ITEM_DEPTHS.has(id)) {
        return {
            id,
            type: ORG_UNIT_ITEM_TYPE_USER,
            depth: USER_ITEM_DEPTHS.get(id),
        }
    }

    if (ouIdHelper.hasLevelPrefix(id)) {
        const level = ouIdHelper.removePrefix(id)

        return {
            id,
            type: ORG_UNIT_ITEM_TYPE_LEVEL,
            level: /^\d+$/.test(level) ? Number(level) : level,
        }
    }

    if (ouIdHelper.hasGroupPrefix(id)) {
        return {
            id,
            type: ORG_UNIT_ITEM_TYPE_GROUP,
            groupId: ouIdHelper.removePrefix(id),
        }
    }

    return {
        id,
        type: UID.test(id)
            ? ORG_UNIT_ITEM_TYPE_ORG_UNIT
            : ORG_UNIT_ITEM_TYPE_UNKNOWN,
    }
}

const isOfType = (...types) => {
    const typeSet = new Set(types)

    return ({ type }) => typeSet.has(type)
}

const isLevelOrGroup = isOfType(
    ORG_UNIT_ITEM_TYPE_LEVEL,
    ORG_UNIT_ITEM_TYPE_GROUP
)

/**
 * A selection as analytics reads it: with a level or a group in it, the org
 * units and the user's org units are parents (districts in Bo, a group's
 * members in the user's district), not items of their own. Gives the
 * `selectionItems` to judge and the `parentItems`.
 */
export const readOrgUnitSelection = (orgUnits = []) => {
    const parsed = orgUnits.map(parseOrgUnitSelectionItem)
    const isParent = isOfType(
        ORG_UNIT_ITEM_TYPE_ORG_UNIT,
        ORG_UNIT_ITEM_TYPE_USER
    )

    return parsed.some(isLevelOrGroup)
        ? {
              selectionItems: parsed.filter((item) => !isParent(item)),
              parentItems: parsed.filter(isParent),
          }
        : { selectionItems: parsed, parentItems: [] }
}

/**
 * What a selection needs fetched: its org units, the roots (a level with no
 * parent), the user's org units, and its groups.
 */
export const getOrgUnitsToFetch = (orgUnits = []) => {
    const parsed = orgUnits.map(parseOrgUnitSelectionItem)
    const ofType = (type) => parsed.filter(isOfType(type))

    return {
        orgUnitIds: ofType(ORG_UNIT_ITEM_TYPE_ORG_UNIT).map(({ id }) => id),
        needsRoots:
            ofType(ORG_UNIT_ITEM_TYPE_LEVEL).length > 0 &&
            !ofType(ORG_UNIT_ITEM_TYPE_ORG_UNIT).length &&
            !ofType(ORG_UNIT_ITEM_TYPE_USER).length,
        needsUserOrgUnits: ofType(ORG_UNIT_ITEM_TYPE_USER).length > 0,
        groupIds: [
            ...new Set(
                ofType(ORG_UNIT_ITEM_TYPE_GROUP).map(({ groupId }) => groupId)
            ),
        ],
    }
}

/**
 * The org units a level or a group is kept under, each with the shallowest
 * level it holds (`minLevel`): an org unit at its own level and below; the
 * user's org units, below their level plus the item's depth (the children of
 * the user's org units hold levels from one below theirs). Without parents,
 * the roots. A parent given twice, or within another that holds its levels,
 * counts once. Null when one isn't loaded.
 */
export const resolveParents = (parentItems, coverage) => {
    const { orgUnits, rootIds = [], userOrgUnitIds } = coverage

    if (!parentItems.length) {
        return rootIds.map((id) => ({ orgUnitId: id, minLevel: 1 }))
    }

    const parents = parentItems.flatMap(({ type, id, depth }) =>
        type === ORG_UNIT_ITEM_TYPE_USER
            ? (userOrgUnitIds ?? [undefined]).map((userId) => ({
                  orgUnitId: userId,
                  minLevel: (orgUnits[userId]?.level ?? 0) + depth,
              }))
            : [{ orgUnitId: id, minLevel: orgUnits[id]?.level }]
    )

    if (!parents.every(({ orgUnitId }) => orgUnits[orgUnitId])) {
        return null
    }

    // A parent given twice counts once, from the shallowest level either holds
    const distinct = [
        ...parents
            .reduce((byId, parent) => {
                const known = byId.get(parent.orgUnitId)

                return known && known.minLevel <= parent.minLevel
                    ? byId
                    : byId.set(parent.orgUnitId, parent)
            }, new Map())
            .values(),
    ]
    // Analytics takes the org units under all parents once each
    const isWithin = (parent, other) =>
        other !== parent &&
        orgUnits[parent.orgUnitId].path.includes(`/${other.orgUnitId}/`) &&
        other.minLevel <= parent.minLevel

    return distinct.filter(
        (parent) => !distinct.some((other) => isWithin(parent, other))
    )
}

// Where the counts of a group's members at one level, under one parent, are kept
export const getGroupCountsKey = (groupId, level, parentOrgUnitId) =>
    `${groupId}:${level}:${parentOrgUnitId ?? ''}`

const getLevelNumber = (level, levels) =>
    typeof level === 'number'
        ? level
        : levels.find(({ id }) => id === level)?.level ?? null

/* A group's members at each level they are at, under each parent that holds
 * that level (or anywhere, without parents) */
const getGroupRequestedLevels = (groupId, parents, groups) => {
    const membersByLevel = groups?.[groupId]

    if (!membersByLevel) {
        return null
    }

    return Object.keys(membersByLevel)
        .map(Number)
        .filter((level) => membersByLevel[level] > 0)
        .flatMap((level) =>
            (parents ?? [{ orgUnitId: null, minLevel: 1 }])
                .filter(({ minLevel }) => minLevel <= level)
                .map(({ orgUnitId }) => ({
                    countsKey: getGroupCountsKey(groupId, level, orgUnitId),
                    level,
                    groupId,
                }))
        )
}

/**
 * The levels analytics aggregates to for a selection item, each with where
 * its counts are kept in the coverage (fetchOrgUnitCoverage): an org unit at
 * its own level; LEVEL-n at level n under each parent that holds it (or under
 * the roots); the user's org units at their level plus the item's depth; a
 * group at each level its members are at, under each parent. An empty list
 * when no parent holds the level. Null when it can't be told: an unknown id
 * or level, or an org unit or group that isn't loaded.
 */
export const getRequestedLevels = (selectionItem, parentItems, coverage) => {
    const { orgUnits, userOrgUnitIds, levels = [] } = coverage
    const atOwnLevel = (orgUnitId, depth = 0) =>
        orgUnits[orgUnitId] && {
            countsKey: orgUnitId,
            level: orgUnits[orgUnitId].level + depth,
        }

    switch (selectionItem.type) {
        case ORG_UNIT_ITEM_TYPE_ORG_UNIT: {
            const requested = atOwnLevel(selectionItem.id)

            return requested ? [requested] : null
        }
        case ORG_UNIT_ITEM_TYPE_LEVEL: {
            const level = getLevelNumber(selectionItem.level, levels)
            const parents = resolveParents(parentItems, coverage)

            if (!level || !parents) {
                return null
            }

            // A level deeper than the hierarchy holds no org unit
            if (levels.length && level > levels.at(-1).level) {
                return []
            }

            return parents
                .filter(({ minLevel }) => minLevel <= level)
                .map(({ orgUnitId }) => ({ countsKey: orgUnitId, level }))
        }
        case ORG_UNIT_ITEM_TYPE_USER: {
            const requested = (userOrgUnitIds ?? []).map((id) =>
                atOwnLevel(id, selectionItem.depth)
            )

            return userOrgUnitIds && !requested.includes(undefined)
                ? requested
                : null
        }
        case ORG_UNIT_ITEM_TYPE_GROUP: {
            const parents = parentItems.length
                ? resolveParents(parentItems, coverage)
                : undefined

            return parents === null
                ? null
                : getGroupRequestedLevels(
                      selectionItem.groupId,
                      parents,
                      coverage.groups
                  )
        }
        default:
            return null
    }
}
