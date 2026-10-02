export const ORG_UNIT_ITEM_UNIT = 'UNIT'
export const ORG_UNIT_ITEM_LEVEL = 'LEVEL'
export const ORG_UNIT_ITEM_GROUP = 'GROUP'
export const ORG_UNIT_ITEM_USER = 'USER'
export const ORG_UNIT_ITEM_UNKNOWN = 'UNKNOWN'

// How many levels below the user's units each user item reaches
const USER_ITEM_DEPTHS = {
    USER_ORGUNIT: 0,
    USER_ORGUNIT_CHILDREN: 1,
    USER_ORGUNIT_GRANDCHILDREN: 2,
}

const UID = /^[a-zA-Z][a-zA-Z0-9]{10}$/

/**
 * What an org unit dimension item is, as DV saves it: a unit id, LEVEL-n
 * (a number, or a level id), OU_GROUP-id, or one of the user's units
 * (USER_ORGUNIT, its children or grandchildren).
 */
export const parseOrgUnitItem = (id) => {
    if (id in USER_ITEM_DEPTHS) {
        return { id, kind: ORG_UNIT_ITEM_USER, depth: USER_ITEM_DEPTHS[id] }
    }

    if (id.startsWith('LEVEL-')) {
        const level = id.slice('LEVEL-'.length)

        return {
            id,
            kind: ORG_UNIT_ITEM_LEVEL,
            level: /^\d+$/.test(level) ? Number(level) : level,
        }
    }

    if (id.startsWith('OU_GROUP-')) {
        return { id, kind: ORG_UNIT_ITEM_GROUP, group: id.slice(9) }
    }

    return UID.test(id)
        ? { id, kind: ORG_UNIT_ITEM_UNIT }
        : { id, kind: ORG_UNIT_ITEM_UNKNOWN }
}

const isBoundedKind = ({ kind }) =>
    kind === ORG_UNIT_ITEM_LEVEL || kind === ORG_UNIT_ITEM_GROUP

/**
 * A selection as analytics reads it: with a level or a group in it, the
 * units are boundaries (districts in Bo), not items of their own. Gives the
 * `items` to judge and the `boundaries` (unit ids).
 */
export const readOrgUnitSelection = (orgUnits = []) => {
    const parsed = orgUnits.map(parseOrgUnitItem)
    const bounded = parsed.some(isBoundedKind)
    const units = parsed.filter(({ kind }) => kind === ORG_UNIT_ITEM_UNIT)

    return {
        items: bounded
            ? parsed.filter(({ kind }) => kind !== ORG_UNIT_ITEM_UNIT)
            : parsed,
        boundaries: bounded ? units.map(({ id }) => id) : [],
    }
}

/* What a selection needs counted: its units, the roots (a level with no
 * boundary), the user's units, and its groups */
export const getUnitsToCount = (orgUnits = []) => {
    const parsed = orgUnits.map(parseOrgUnitItem)
    const ofKind = (kind) => parsed.filter((item) => item.kind === kind)

    return {
        unitIds: ofKind(ORG_UNIT_ITEM_UNIT).map(({ id }) => id),
        needsRoots:
            ofKind(ORG_UNIT_ITEM_LEVEL).length > 0 &&
            !ofKind(ORG_UNIT_ITEM_UNIT).length,
        needsUser: ofKind(ORG_UNIT_ITEM_USER).length > 0,
        groupIds: [
            ...new Set(ofKind(ORG_UNIT_ITEM_GROUP).map(({ group }) => group)),
        ],
    }
}

// Where the counts of a group's members at one level, under a boundary, are kept
export const getGroupCountsKey = (group, level, boundary) =>
    `${group}:${level}:${boundary ?? ''}`

/* A group's members at each level they are at, under each boundary at or
 * above it: analytics keeps the members inside the boundaries */
const getGroupTargets = (group, boundaries, { units, groups }) => {
    const memberLevels = groups?.[group]
    const within = boundaries.length ? boundaries : [null]

    if (!memberLevels || boundaries.some((unitId) => !units[unitId])) {
        return null
    }

    return Object.keys(memberLevels)
        .map(Number)
        .filter((level) => memberLevels[level] > 0)
        .flatMap((level) =>
            within
                .filter((unitId) => !unitId || units[unitId].level <= level)
                .map((unitId) => ({
                    key: getGroupCountsKey(group, level, unitId),
                    level,
                    group,
                }))
        )
}

const getLevelNumber = (level, levels) =>
    typeof level === 'number'
        ? level
        : levels.find(({ id }) => id === level)?.level ?? null

/**
 * The places an item covers, each as a unit and the level asked under it:
 * a unit at its own level, LEVEL-n at level n under each boundary (or under
 * the roots), the user's units at their level plus the item's depth. A
 * group gives its members at each level, under each boundary, kept by `key`
 * (getGroupCountsKey). Null when it can't be told: an unknown id or level,
 * or a unit or group whose counts aren't loaded.
 */
export const getOrgUnitTargets = (item, boundaries, coverage) => {
    const { units, roots = [], userUnits, levels = [] } = coverage
    const unitTarget = (unitId, depth = 0) =>
        units[unitId] && { unitId, level: units[unitId].level + depth }

    switch (item.kind) {
        case ORG_UNIT_ITEM_UNIT: {
            const target = unitTarget(item.id)

            return target ? [target] : null
        }
        case ORG_UNIT_ITEM_LEVEL: {
            const level = getLevelNumber(item.level, levels)
            const within = boundaries.length ? boundaries : roots

            if (!level || within.some((unitId) => !units[unitId])) {
                return null
            }

            return within
                .filter((unitId) => units[unitId].level <= level)
                .map((unitId) => ({ unitId, level }))
        }
        case ORG_UNIT_ITEM_USER: {
            const targets = (userUnits ?? []).map((unitId) =>
                unitTarget(unitId, item.depth)
            )

            return userUnits && !targets.includes(undefined) ? targets : null
        }
        case ORG_UNIT_ITEM_GROUP:
            return getGroupTargets(item.group, boundaries, coverage)
        default:
            return null
    }
}
