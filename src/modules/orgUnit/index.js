const LEVEL_ID_PREFIX = 'LEVEL'
const GROUP_ID_PREFIX = 'OU_GROUP'

const isGroupId = id => id.substr(0, GROUP_ID_PREFIX.length) === GROUP_ID_PREFIX

const isLevelId = id => id.substr(0, LEVEL_ID_PREFIX.length) === LEVEL_ID_PREFIX

const stripLevelPrefix = id =>
    isLevelId(id) ? id.substr(LEVEL_ID_PREFIX.length + 1) : id

const stripGroupPrefix = id =>
    isGroupId(id) ? id.substr(GROUP_ID_PREFIX.length + 1) : id

export const orgUnit = Object.freeze({
    getLevelId: id => `${LEVEL_ID_PREFIX}-${id}`,
    getGroupId: id => `${GROUP_ID_PREFIX}-${id}`,
    getUid: id => stripGroupPrefix(stripLevelPrefix(id)),
    isGroupId,
    isLevelId,
})
