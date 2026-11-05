import { orgUnitLevelsQuery } from '../organisationUnits.js'

/* Requests on organisationUnits, all metadata. Counts use pageSize=1: the
 * total is in the pager, so a large hierarchy costs no more per count. */

// A count with no list
export const countQuery = (filter) => ({
    resource: 'organisationUnits',
    params: { filter, fields: 'id', pageSize: 1 },
})

export const getTotal = (response) => response?.pager?.total ?? 0

export const getAncestorIds = ({ id, path }) =>
    path.split('/').filter((ancestorId) => ancestorId && ancestorId !== id)

// The filter on org units a data set or program ({ id, field }) is assigned to
export const assignedTo = ({ id, field }) => `${field}.id:eq:${id}`

export const inGroup = (groupId) => `organisationUnitGroups.id:eq:${groupId}`

// Requests sent at once: a few hundred in one go make the server queue them
const BATCH_SIZE = 100

const getQueryKey = ({ resource, params }) => JSON.stringify([resource, params])

const queryBatch = async (engine, batch, signal) => {
    const response = await engine.query(
        Object.fromEntries(batch.map((query, i) => [`query${i}`, query])),
        { signal }
    )

    return batch.map((_, i) => response[`query${i}`])
}

/**
 * Sends the queries of `[key, query]` pairs and gives `{ responses, requests }`:
 * the responses in the same order, and how many requests were sent. Each
 * distinct query is sent once (siblings share their ancestors' counts), in
 * batches of BATCH_SIZE one after the other; the data engine sends one
 * request per query.
 */
export const queryAll = async (engine, queries, { signal } = {}) => {
    const indexByKey = new Map()
    const distinct = []
    const positions = queries.map(([, query]) => {
        const key = getQueryKey(query)

        if (!indexByKey.has(key)) {
            indexByKey.set(key, distinct.length)
            distinct.push(query)
        }

        return indexByKey.get(key)
    })
    const batches = Array.from(
        { length: Math.ceil(distinct.length / BATCH_SIZE) },
        (_, i) => distinct.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
    )
    const responses = await batches.reduce(
        async (done, batch) => [
            ...(await done),
            ...(await queryBatch(engine, batch, signal)),
        ],
        Promise.resolve([])
    )

    return {
        responses: positions.map((index) => responses[index]),
        requests: distinct.length,
    }
}

export const levelsQuery = { levels: orgUnitLevelsQuery }

export const readLevels = (response) =>
    (response?.levels?.organisationUnitLevels ?? [])
        .map(({ id, level, displayName }) => ({ id, level, name: displayName }))
        .sort((a, b) => a.level - b.level)
