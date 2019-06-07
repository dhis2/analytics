import { LEVEL_ID_PREFIX, GROUP_ID_PREFIX } from './internal/constants'
import { isOuLevelId } from './isOuLevelId'
import { isOuGroupId } from './isOuGroupId'

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
