import { onError } from './index'

const orgUnitLevelsQuery = {
    orgUnitLevels: {
        resource: 'organisationUnitLevels',
        params: {
            fields: 'id,level,displayName,name',
            paging: false,
        },
    },
}

const orgUnitGroupsQuery = {
    orgUnitGroups: {
        resource: 'organisationUnitGroups',
        params: ({ displayNameProp }) => ({
            fields: `id,${displayNameProp}~rename(displayName),name`,
            paging: false,
        }),
    },
}

const orgUnitRootsQuery = {
    orgUnitRoots: {
        resource: 'organisationUnits',
        params: {
            fields: 'id,displayName,name',
            userDataViewFallback: true,
            paging: false,
        },
    },
}

const orgUnitsQuery = {
    orgUnits: {
        resource: 'organisationUnits',
        params: ({ displayNameProp }) => ({
            fields: `id,path,${displayNameProp}~rename(displayName),children::isNotEmpty`,
            level: 1,
            userDataViewFallback: true,
            paging: false,
        }),
    },
}

const orgUnitQuery = {
    orgUnit: {
        resource: 'organisationUnits',
        id: ({ id }) => id,
        params: {
            fields:
                'id,level,displayName~rename(name),path,parent[id,displayName~rename(name)],children[level]',
            userDataViewFallback: true,
            paging: false,
        },
    },
}

export const apiFetchOrganisationUnitLevels = async dataEngine => {
    const orgUnitLevelsData = await dataEngine.query(orgUnitLevelsQuery, {
        onError,
    })

    return orgUnitLevelsData.orgUnitLevels.organisationUnitLevels
}

export const apiFetchOrganisationUnitGroups = async (
    dataEngine,
    displayNameProp
) => {
    const orgUnitGroupsData = await dataEngine.query(orgUnitGroupsQuery, {
        variables: {
            displayNameProp,
        },
        onError,
    })

    return orgUnitGroupsData.orgUnitGroups.organisationUnitGroups
}

export const apiFetchOrganisationUnitRoots = async dataEngine => {
    const orgUnitRootsData = await dataEngine.query(orgUnitRootsQuery, {
        onError,
    })

    return orgUnitRootsData.orgUnitRoots.organisationUnits
}

export const apiFetchOrganisationUnits = async (
    dataEngine,
    displayNameProp
) => {
    const orgUnitsData = await dataEngine.query(orgUnitsQuery, {
        variables: {
            displayNameProp,
        },
        onError,
    })

    return orgUnitsData.orgUnits.organisationUnits
}

export const apiFetchOrganisationUnit = async (dataEngine, id) => {
    const orgUnitData = await dataEngine.query(orgUnitQuery, {
        variables: { id },
        onError,
    })

    return orgUnitData.orgUnit
}
