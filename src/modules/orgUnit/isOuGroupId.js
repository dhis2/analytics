import { GROUP_ID_PREFIX } from './internal/constants'

/**
 * Returns true if id is ou group id
 * @param id
 * @returns {boolean}
 */
export const isOuGroupId = id =>
    id.substr(0, GROUP_ID_PREFIX.length) === GROUP_ID_PREFIX
