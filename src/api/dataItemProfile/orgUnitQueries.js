/* Requests on organisationUnits, all metadata. Counts use pageSize=1: the
 * total is in the pager, so large hierarchies cost the same. */

// A count with no list
export const countQuery = (filter) => ({
    resource: 'organisationUnits',
    params: { filter, fields: 'id', pageSize: 1 },
})

export const getTotal = (response) => response?.pager?.total ?? 0

// The filter on org units a data set or program ({ id, field }) is assigned to
export const assignedTo = ({ id, field }) => `${field}.id:eq:${id}`

export const inGroup = (groupId) => `organisationUnitGroups.id:eq:${groupId}`

/**
 * Sends `queries`, `[key, query]` pairs, in one request; the response for
 * the i-th is `count<i>`.
 */
export const queryAll = (engine, queries) =>
    queries.length
        ? engine.query(
              Object.fromEntries(
                  queries.map(([, query], i) => [`count${i}`, query])
              )
          )
        : {}

export const levelsQuery = {
    levels: {
        resource: 'organisationUnitLevels',
        params: { fields: 'id,level,displayName', paging: false },
    },
}

export const readLevels = (response) =>
    (response?.levels?.organisationUnitLevels ?? [])
        .map(({ id, level, displayName }) => ({ id, level, name: displayName }))
        .sort((a, b) => a.level - b.level)
