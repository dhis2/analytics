import { getOrgUnitsToFetch } from '../../modules/dataItemProfile/orgUnits/orgUnitSelection.js'
import { levelsQuery, readLevels } from './orgUnitQueries.js'

const ORG_UNIT_FIELDS = 'id,level,path,displayName'

const orgUnitsQuery = (filter) => ({
    resource: 'organisationUnits',
    params: { filter, fields: ORG_UNIT_FIELDS, paging: false },
})

const userOrgUnitsQuery = {
    resource: 'me',
    params: {
        fields: `organisationUnits[${ORG_UNIT_FIELDS}],dataViewOrganisationUnits[${ORG_UNIT_FIELDS}]`,
    },
}

const byId = (orgUnits = []) =>
    Object.fromEntries(
        orgUnits.map(({ id, level, path, displayName }) => [
            id,
            { id, level, path, name: displayName },
        ])
    )

/**
 * The org units a selection (DV's org unit items) needs, in one request,
 * beyond those `previous` (an earlier coverage) knows: the levels, the
 * selection's org units, the roots and the user's org units. The roots are
 * always loaded: with a single root, its counts are the counts across the
 * hierarchy. Gives `{ levels, orgUnits, rootIds, userOrgUnitIds, requests }`.
 */
export const fetchSelectionOrgUnits = async (
    engine,
    { orgUnitItems, previous, signal }
) => {
    const { orgUnitIds, needsUserOrgUnits } = getOrgUnitsToFetch(orgUnitItems)
    const known = previous?.orgUnits ?? {}
    const missingIds = orgUnitIds.filter((id) => !known[id])
    const fetchRoots = !previous?.rootIds?.length
    const fetchUser = needsUserOrgUnits && !previous?.userOrgUnitIds
    const query = {
        ...(!previous?.levels?.length && levelsQuery),
        ...(missingIds.length && {
            orgUnits: orgUnitsQuery(`id:in:[${missingIds.join(',')}]`),
        }),
        ...(fetchRoots && { roots: orgUnitsQuery('level:eq:1') }),
        ...(fetchUser && { me: userOrgUnitsQuery }),
    }
    const requests = Object.keys(query).length
    const response = requests ? await engine.query(query, { signal }) : {}
    // Analytics reads the user's data view org units when there are some
    const userOrgUnits = response.me?.dataViewOrganisationUnits?.length
        ? response.me.dataViewOrganisationUnits
        : response.me?.organisationUnits
    const rootIds = fetchRoots
        ? (response.roots?.organisationUnits ?? []).map(({ id }) => id)
        : previous.rootIds
    const userOrgUnitIds = fetchUser
        ? (userOrgUnits ?? []).map(({ id }) => id)
        : previous?.userOrgUnitIds ?? null

    return {
        levels: response.levels ? readLevels(response) : previous.levels,
        orgUnits: {
            ...known,
            ...byId(response.orgUnits?.organisationUnits),
            ...byId(response.roots?.organisationUnits),
            ...byId(userOrgUnits),
        },
        rootIds,
        userOrgUnitIds,
        requests,
    }
}
