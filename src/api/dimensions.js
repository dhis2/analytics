import sortBy from 'lodash/sortBy'

import { onError } from './index'
import { DATA_SETS_CONSTANTS } from '../modules/dataSets'
import { CHART_AGGREGATE_AGGREGATABLE_TYPES } from '../modules/dataTypes'

// Query definitions
export const dimensionsQuery = {
    resource: 'dimensions',
    params: ({ nameProp }) => ({
        fields: `id,${nameProp}~rename(name),dimensionType,dataDimensionType`,
        order: `${nameProp}:asc`,
        paging: false,
    }),
}

const recommendedDimensionsQuery = {
    resource: 'dimensions/recommendations',
    params: ({ dxIds, ouIds }) => {
        const dimensions = []

        if (dxIds.length) {
            dimensions.push(`dx:${dxIds.join(';')}`)
        }

        if (ouIds.length) {
            dimensions.push(`ou:${ouIds.join(';')}`)
        }

        return {
            fields: 'id',
            dimension: dimensions,
        }
    },
}

export const indicatorsQuery = {
    resource: 'indicators',
    params: ({ nameProp, groupId, filterText, page }) => {
        const filters = []

        if (groupId !== 'ALL') {
            filters.push(`indicatorGroups.id:eq:${groupId}`)
        }

        if (filterText) {
            filters.push(`${nameProp}:ilike:${filterText}`)
        }

        return {
            fields: `id,${nameProp}~rename(name),dimensionItemType`,
            order: `${nameProp}:asc`,
            filter: filters,
            paging: true,
            page,
        }
    },
}

export const indicatorGroupsQuery = {
    resource: 'indicatorGroups',
    params: ({ nameProp }) => ({
        fields: `id,${nameProp}~rename(name)`,
        order: `${nameProp}:asc`,
        paging: false,
    }),
}

export const dataElementsQuery = {
    resource: 'dataElements',
    params: ({ nameProp, groupId, filterText, page }) => {
        const idField = groupId === 'ALL' ? 'id' : 'dimensionItem~rename(id)'
        const filters = ['domainType:eq:AGGREGATE']

        if (groupId !== 'ALL') {
            filters.push(`dataElementGroups.id:eq:${groupId}`)
        }

        if (filterText) {
            filters.push(`${nameProp}:ilike:${filterText}`)
        }

        return {
            fields: `${idField},${nameProp}~rename(name)`,
            order: `${nameProp}:asc`,
            filter: filters,
            paging: true,
            page,
        }
    },
}

export const dataElementGroupsQuery = {
    resource: 'dataElementGroups',
    params: ({ nameProp }) => ({
        fields: `id,${nameProp}~rename(name)`,
        order: `${nameProp}:asc`,
        paging: false,
    }),
}

export const itemsByDimensionQuery = {
    resource: `dimensions`,
    id: ({ id }) => `${id}/items`,
    params: ({ searchTerm, page }) => {
        const filters = []

        if (searchTerm) {
            filters.push(`name:ilike:${searchTerm}`)
        }

        return {
            fields: 'id,displayName~rename(name)',
            order: 'displayName:asc',
            filter: filters,
            paging: true,
            page,
        }
    },
}

export const dataElementOperandsQuery = {
    resource: 'dataElementOperands',
    params: ({ nameProp, groupId, filterText, page }) => {
        const idField = groupId === 'ALL' ? 'id' : 'dimensionItem~rename(id)'
        const filters = []

        if (groupId !== 'ALL') {
            filters.push(`dataElement.dataElementGroups.id:eq:${groupId}`)
        }

        if (filterText) {
            filters.push(`${nameProp}:ilike:${filterText}`)
        }

        return {
            fields: `${idField},${nameProp}~rename(name)`,
            order: `${nameProp}:asc`,
            filter: filters,
            paging: true,
            page,
        }
    },
}

export const dataSetsQuery = {
    resource: 'dataSets',
    params: ({ nameProp, filterText, page }) => {
        const filters = []

        if (filterText) {
            filters.push(`${nameProp}:ilike:${filterText}`)
        }

        return {
            fields: `dimensionItem~rename(id),${nameProp}~rename(name)`,
            order: `${nameProp}:asc`,
            filter: filters,
            paging: true,
            page,
        }
    },
}

export const programsQuery = {
    resource: 'programs',
    params: ({ nameProp }) => ({
        fields: `id,${nameProp}~rename(name)`,
        order: `${nameProp}:asc`,
        paging: false,
    }),
}

export const programDataElementsQuery = {
    resource: 'programDataElements',
    params: ({ nameProp, groupId, filterText, page }) => {
        const filters = []

        if (filterText) {
            filters.push(`${nameProp}:ilike:${filterText}`)
        }

        return {
            fields: `dimensionItem~rename(id),${nameProp}~rename(name),valueType`,
            order: `${nameProp}:asc`,
            program: groupId,
            filter: filters,
            paging: true,
            page,
        }
    },
}

export const programIndicatorsQuery = {
    resource: 'programIndicators',
    params: ({ nameProp, groupId, filterText, page }) => {
        const filters = [`program.id:eq:${groupId}`]

        if (filterText) {
            filters.push(`${nameProp}:ilike:${filterText}`)
        }

        return {
            fields: `dimensionItem~rename(id),${nameProp}~rename(name)`,
            order: `${nameProp}:asc`,
            filter: filters,
            paging: true,
            page,
        }
    },
}

export const trackedEntityAttributesQuery = {
    resource: 'programs',
    id: ({ id }) => id,
    params: ({ nameProp, filterText }) => {
        const filters = []

        if (filterText) {
            filters.push(`${nameProp}:ilike:${filterText}`)
        }

        return {
            fields: `${nameProp}~rename(name),programTrackedEntityAttributes[trackedEntityAttribute[id,${nameProp}~rename(name),valueType]]`,
            filter: filters,
            paging: false,
        }
    },
}

// Fetch functions
export const apiFetchDimensions = async (dataEngine, nameProp) => {
    const dimensionsData = await dataEngine.query(
        { dimensions: dimensionsQuery },
        {
            variables: { nameProp },
            onError,
        }
    )

    return dimensionsData.dimensions.dimensions
}

export const apiFetchRecommendedIds = async (dataEngine, dxIds, ouIds) => {
    const recommendedDimensionsData = await dataEngine.query(
        { recommendedDimensions: recommendedDimensionsQuery },
        {
            variables: {
                dxIds,
                ouIds,
            },
            onError,
        }
    )

    return recommendedDimensionsData.recommendedDimensions.dimensions.map(
        item => item.id
    )
}

export const apiFetchGroups = async (dataEngine, dataType, nameProp) => {
    // indicatorGroups does not support shortName
    const name = dataType === 'indicators' ? 'displayName' : nameProp

    switch (dataType) {
        case 'indicators': {
            const indicatorGroupsData = await dataEngine.query(
                { indicatorGroups: indicatorGroupsQuery },
                {
                    variables: {
                        nameProp: name,
                    },
                    onError,
                }
            )

            return indicatorGroupsData.indicatorGroups.indicatorGroups
        }
        case 'dataElements': {
            const dataElementGroupsData = await dataEngine.query(
                { dataElementGroups: dataElementGroupsQuery },
                {
                    variables: {
                        nameProp: name,
                    },
                    onError,
                }
            )

            return dataElementGroupsData.dataElementGroups.dataElementGroups
        }
        case 'dataSets': {
            const dataSetGroups = DATA_SETS_CONSTANTS.map(
                ({ id, getName }) => ({
                    id,
                    name: getName(),
                })
            )
            return dataSetGroups
        }
        case 'eventDataItems':
        case 'programIndicators': {
            const programsData = await dataEngine.query(
                { programs: programsQuery },
                {
                    variables: {
                        nameProp: name,
                    },
                    onError,
                }
            )

            return programsData.programs.programs
        }
        default:
            return null
    }
}

export const apiFetchAlternatives = ({
    dataEngine,
    dataType,
    groupDetail,
    ...queryParams
}) => {
    switch (dataType) {
        case 'indicators': {
            return fetchIndicators({ dataEngine, ...queryParams })
        }
        case 'dataElements': {
            if (groupDetail === 'detail') {
                return fetchDataElementOperands({ dataEngine, ...queryParams })
            } else {
                return fetchDataElements({ dataEngine, ...queryParams })
            }
        }
        case 'dataSets': {
            return fetchDataSets({ dataEngine, ...queryParams })
        }
        case 'eventDataItems': {
            return queryParams.groupId
                ? getEventDataItems({ dataEngine, ...queryParams })
                : null
        }
        case 'programIndicators': {
            return queryParams.groupId
                ? fetchProgramIndicators({ dataEngine, ...queryParams })
                : null
        }
        default:
            return null
    }
}

const fetchIndicators = async ({
    dataEngine,
    nameProp,
    groupId,
    filterText,
    page,
}) => {
    const indicatorsData = await dataEngine.query(
        { indicators: indicatorsQuery },
        {
            variables: {
                nameProp,
                groupId,
                filterText,
                page,
            },
            onError,
        }
    )

    const response = indicatorsData.indicators

    return formatResponse(response.indicators, response.pager)
}

const formatResponse = (dimensionItems, pager) => ({
    dimensionItems,
    nextPage: pager.nextPage ? pager.page + 1 : null,
})

const fetchDataElements = async ({
    dataEngine,
    nameProp,
    groupId,
    filterText,
    page,
}) => {
    const dataElementsData = await dataEngine.query(
        { dataElements: dataElementsQuery },
        {
            variables: {
                nameProp,
                groupId,
                filterText,
                page,
            },
            onError,
        }
    )

    const response = dataElementsData.dataElements

    return formatResponse(response.dataElements, response.pager)
}

export const apiFetchItemsByDimension = async ({
    dataEngine,
    dimensionId,
    searchTerm,
    page,
}) => {
    const itemsByDimensionData = await dataEngine.query(
        { itemsByDimensions: itemsByDimensionQuery },
        {
            variables: {
                id: dimensionId,
                searchTerm,
                page,
            },
            onError,
        }
    )

    const response = itemsByDimensionData.itemsByDimensions

    return formatResponse(response.items, response.pager)
}

const fetchDataElementOperands = async ({
    dataEngine,
    nameProp,
    groupId,
    filterText,
    page,
}) => {
    const dataElementOperandsData = await dataEngine.query(
        { dataElementOperands: dataElementOperandsQuery },
        {
            variables: {
                nameProp,
                groupId,
                filterText,
                page,
            },
            onError,
        }
    )

    const response = dataElementOperandsData.dataElementOperands

    return formatResponse(response.dataElementOperands, response.pager)
}

const fetchDataSets = async ({ dataEngine, nameProp, filterText, page }) => {
    const dataSetsData = await dataEngine.query(
        { dataSets: dataSetsQuery },
        {
            variables: {
                nameProp,
                filterText,
                page,
            },
            onError,
        }
    )

    const response = dataSetsData.dataSets

    return formatResponse(response.dataSets, response.pager)
}

const fetchProgramIndicators = async ({
    dataEngine,
    nameProp,
    groupId,
    filterText,
    page,
}) => {
    const programIndicatorsData = await dataEngine.query(
        { programIndicators: programIndicatorsQuery },
        {
            variables: {
                nameProp,
                groupId,
                filterText,
                page,
            },
            onError,
        }
    )

    const response = programIndicatorsData.programIndicators

    return formatResponse(response.programIndicators, response.pager)
}

const fetchProgramDataElements = async ({
    dataEngine,
    nameProp,
    groupId,
    filterText,
    page,
}) => {
    const programDataElementsData = await dataEngine.query(
        { programDataElements: programDataElementsQuery },
        {
            variables: {
                nameProp,
                groupId,
                filterText,
                page,
            },
            onError,
        }
    )

    const response = programDataElementsData.programDataElements

    return formatResponse(response.programDataElements, response.pager)
}

const fetchTrackedEntityAttributes = async ({
    dataEngine,
    nameProp,
    groupId,
    filterText,
}) => {
    const trackedEntityAttributesData = await dataEngine.query(
        { trackedEntityAttributes: trackedEntityAttributesQuery },
        {
            variables: {
                nameProp,
                id: groupId,
                filterText,
            },
            onError,
        }
    )

    const r = trackedEntityAttributesData.trackedEntityAttributes

    return Array.isArray(r.programTrackedEntityAttributes)
        ? r.programTrackedEntityAttributes
              .map(a => a.trackedEntityAttribute)
              .map(a => ({
                  ...a,
                  id: `${groupId}.${a.id}`,
                  name: `${r.name} ${a.name}`,
              }))
        : []
}

const getEventDataItems = async args => {
    const [dataElementsObj, attributes] = await Promise.all([
        fetchProgramDataElements(args),
        fetchTrackedEntityAttributes(args),
    ])

    const filterInvalidTypes = item =>
        Boolean(CHART_AGGREGATE_AGGREGATABLE_TYPES.includes(item.valueType))

    return {
        ...dataElementsObj,
        dimensionItems: sortBy(
            [...dataElementsObj.dimensionItems, ...attributes].filter(
                filterInvalidTypes
            ),
            'name'
        ),
    }
}
