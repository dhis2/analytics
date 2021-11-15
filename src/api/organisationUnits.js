import { onError } from './index'

const orgUnitLevelsQuery = {
    resource: 'organisationUnitLevels',
    params: ({ displayNameProp = 'displayName' } = {}) => ({
        fields: `id,level,${displayNameProp}~rename(displayName),name`,
        paging: false,
    }),
}

const orgUnitGroupsQuery = {
    resource: 'organisationUnitGroups',
    params: ({ displayNameProp = 'displayName' }) => ({
        fields: `id,${displayNameProp}~rename(displayName),name`,
        paging: false,
    }),
}

const orgUnitRootsQuery = {
    resource: 'organisationUnits',
    params: {
        fields: 'id,displayName,name',
        userDataViewFallback: true,
        paging: false,
    },
}

const orgUnitsQuery = {
    resource: 'organisationUnits',
    params: ({ displayNameProp }) => ({
        fields: `id,path,${displayNameProp}~rename(displayName),children::isNotEmpty`,
        level: 1,
        userDataViewFallback: true,
        paging: false,
    }),
}

const orgUnitQuery = {
    resource: 'organisationUnits',
    id: ({ id }) => id,
    params: {
        fields: 'id,level,displayName~rename(name),path,parent[id,displayName~rename(name)],children[level]',
        userDataViewFallback: true,
        paging: false,
    },
}

export const apiFetchOrganisationUnitLevels = async dataEngine => {
    const orgUnitLevelsData = await dataEngine.query(
        { orgUnitLevels: orgUnitLevelsQuery },
        {
            onError,
        }
    )

    return orgUnitLevelsData.orgUnitLevels.organisationUnitLevels
}

export const apiFetchOrganisationUnitGroups = async (
    dataEngine,
    displayNameProp
) => {
    const orgUnitGroupsData = await dataEngine.query(
        { orgUnitGroups: orgUnitGroupsQuery },
        {
            variables: {
                displayNameProp,
            },
            onError,
        }
    )

    return orgUnitGroupsData.orgUnitGroups.organisationUnitGroups
}

export const apiFetchOrganisationUnitRoots = async dataEngine => {
    const orgUnitRootsData = await dataEngine.query(
        { orgUnitRoots: orgUnitRootsQuery },
        {
            onError,
        }
    )

    return orgUnitRootsData.orgUnitRoots.organisationUnits
}

// TODO: Unused, previously used to load all org units for the tree, but that is done by the ui component internally now, remove?
export const apiFetchOrganisationUnits = async (
    dataEngine,
    displayNameProp
) => {
    const orgUnitsData = await dataEngine.query(
        { orgUnits: orgUnitsQuery },
        {
            variables: {
                displayNameProp,
            },
            onError,
        }
    )

    return orgUnitsData.orgUnits.organisationUnits
}

export const apiFetchOrganisationUnit = async (dataEngine, id) => {
    const orgUnitData = await dataEngine.query(
        { orgUnit: orgUnitQuery },
        {
            variables: { id },
            onError,
        }
    )

    return orgUnitData.orgUnit
}
