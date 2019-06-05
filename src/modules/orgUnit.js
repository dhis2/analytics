/**
 * Org unit level id prefix
 * @type {string}
 */
export const LEVEL_ID_PREFIX = 'LEVEL'

/**
 * Detects if id is ou level id
 * @param id
 * @returns {boolean}
 */
export const isOuLevelId = id => {
    return id.substr(0, LEVEL_ID_PREFIX.length) === LEVEL_ID_PREFIX
}

export const getOuLevelId = id => {
    return `${LEVEL_ID_PREFIX}-${id}`
}

/**
 * Org unit group id prefix
 * @type {string}
 */
export const GROUP_ID_PREFIX = 'OU_GROUP'

/**
 * Detects if id is group id
 * @param id
 * @returns {boolean}
 */
export const isOuGroupId = id => {
    return id.substr(0, GROUP_ID_PREFIX.length) === GROUP_ID_PREFIX
}

export const getOuGroupId = id => {
    return `${GROUP_ID_PREFIX}-${id}`
}

/**
 * Get org unit path by ou id
 * @param id
 * @param metadata
 * @param parentGraphMap
 * @returns {*}
 */
export const getOrgUnitPath = (id, metadata, parentGraphMap) => {
    if (metadata[id] && metadata[id].path) {
        return metadata[id].path
    }

    // for root org units
    if (parentGraphMap[id] === id || parentGraphMap[id] === '') {
        return `/${id}`
    }

    return parentGraphMap[id] ? `/${parentGraphMap[id]}/${id}` : undefined
}

const stripLevelPrefix = id =>
    isOuLevelId(id) ? id.substr(LEVEL_ID_PREFIX.length + 1) : id

const stripGroupPrefix = id =>
    isOuGroupId(id) ? id.substr(GROUP_ID_PREFIX.length + 1) : id

/**
 * Returns the uid of the org unit after stripping off LEVEL- and OU_GROUP-
 * @param id
 * @returns String
 */
export const getOuUid = id => stripGroupPrefix(stripLevelPrefix(id))

/**
 * Get org units from ou dimension ids
 * @param ids {Array}
 * @param idsToExclude {Array}
 * @param metadata {Object}
 * @param parentGraphMap {Object}
 * @returns { [{id: String, name: String, path: String}] }
 */
export const getOrgUnitsFromIds = (
    ids,
    metadata,
    parentGraphMap,
    idsToExclude = []
) => {
    return ids
        .filter(id => !idsToExclude.includes(id))
        .filter(id => metadata[getOuUid(id)] !== undefined)
        .map(id => {
            const ouId = getOuUid(id)
            return {
                id,
                name: metadata[ouId].displayName || metadata[ouId].name,
                path: getOrgUnitPath(ouId, metadata, parentGraphMap),
            }
        })
}

/**
 * Get levels from ou dimension ids
 * @param ids
 * @param levelOptions
 * @returns {*}
 */
export const getOuLevelsFromIds = (ids, levelOptions) => {
    if (levelOptions.length === 0) {
        return []
    }

    return ids
        .filter(isOuLevelId)
        .map(getOuUid)
        .map(id => levelOptions.find(option => option.id === id))
        .map(level => level.id)
}

/**
 * Get groups from ou dimension ids
 * @param ids
 * @param groupOptions
 * @returns {*}
 */
export const getOuGroupsFromIds = (ids, groupOptions) => {
    if (groupOptions.length === 0) {
        return []
    }

    return ids.filter(isOuGroupId).map(getOuUid)
}

/**
 * Sort org unit levels by level property
 * @returns {number}
 * @param levelOptions
 */
export const sortOrgUnitLevels = levelOptions => {
    return levelOptions.sort((a, b) => {
        if (a.level < b.level) {
            return -1
        }

        if (a.level > b.level) {
            return 1
        }

        return 0
    })
}

/**
 * Transform options into metadata
 * @param options
 * @param fields
 * @param metadata
 * @returns {{options: *, metadata}}
 */
export const transformOptionsIntoMetadata = (
    options,
    metadata,
    fields = ['id', 'displayName', 'name']
) => {
    const result = {}

    for (let i = 0; i < options.length; ++i) {
        // skip if we already have this property in metadata
        if (metadata[options[i].id] !== undefined) {
            break
        }

        result[options[i].id] = {}
        fields.forEach(field => {
            result[options[i].id][field] = options[i][field]
        })
    }

    return {
        options,
        metadata: result,
    }
}
