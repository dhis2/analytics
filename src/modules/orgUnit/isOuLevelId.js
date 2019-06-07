import { LEVEL_ID_PREFIX } from './internal/constants'

/**
 * Returns true if id is ou level id
 * @param id
 * @returns {boolean}
 */
export const isOuLevelId = id =>
    id.substr(0, LEVEL_ID_PREFIX.length) === LEVEL_ID_PREFIX
