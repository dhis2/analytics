const LEVEL_ID_PREFIX = 'LEVEL'
const GROUP_ID_PREFIX = 'OU_GROUP'

const hasGroupPrefix = id =>
    id.substr(0, GROUP_ID_PREFIX.length) === GROUP_ID_PREFIX

const hasLevelPrefix = id =>
    id.substr(0, LEVEL_ID_PREFIX.length) === LEVEL_ID_PREFIX

const stripLevelPrefix = id =>
    hasLevelPrefix(id) ? id.substr(LEVEL_ID_PREFIX.length + 1) : id

const stripGroupPrefix = id =>
    hasGroupPrefix(id) ? id.substr(GROUP_ID_PREFIX.length + 1) : id

const removePrefix = id => stripGroupPrefix(stripLevelPrefix(id))

export const orgUnitId = Object.freeze({
    addLevelPrefix: id => `${LEVEL_ID_PREFIX}-${removePrefix(id)}`,
    addGroupPrefix: id => `${GROUP_ID_PREFIX}-${removePrefix(id)}`,
    removePrefix,
    hasGroupPrefix,
    hasLevelPrefix,
})
