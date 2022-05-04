import objectClean from 'd2-utilizr/lib/objectClean'
import {
    ALL_ID,
    // CHART_AGGREGATE_AGGREGATABLE_TYPES,
    INDICATOR,
    DATA_ELEMENT,
    DATA_SETS,
    PROGRAM_INDICATOR,
    EVENT_DATA_ITEM,
    PROGRAM_DATA_ELEMENT,
    PROGRAM_ATTRIBUTE,
    TOTALS,
} from '../modules/dataTypes.js'
import { onError } from './index.js'

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

export const dataItemsQuery = {
    resource: 'dataItems',
    params: ({ nameProp, filter, searchTerm, page }) => {
        const filters = []

        // TODO: Extract all of this logic out of the query?
        if (filter?.dataType === EVENT_DATA_ITEM) {
            filters.push(
                `dimensionItemType:in:[${PROGRAM_DATA_ELEMENT},${PROGRAM_ATTRIBUTE}]`
            )
        } else if (filter?.dataType && filter.dataType !== ALL_ID) {
            filters.push(`dimensionItemType:eq:${filter.dataType}`)
        }
        if (
            filter?.group &&
            filter.group !== ALL_ID &&
            [EVENT_DATA_ITEM, PROGRAM_INDICATOR].includes(filter.dataType)
        ) {
            filters.push(`programId:eq:${filter.group}`)
        }

        if (searchTerm) {
            filters.push(`${nameProp}:ilike:${searchTerm}`)
        }

        return objectClean({
            fields: `id,${nameProp}~rename(name),dimensionItemType`,
            order: `${nameProp}:asc`,
            filter: filters,
            paging: true,
            page,
        })
    },
}

export const indicatorsQuery = {
    resource: 'indicators',
    params: ({ nameProp, filter, searchTerm, page }) => {
        const filters = []

        if (filter?.group && filter.group !== ALL_ID) {
            filters.push(`indicatorGroups.id:eq:${filter.group}`)
        }

        if (searchTerm) {
            filters.push(`${nameProp}:ilike:${searchTerm}`)
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
    params: ({ nameProp, filter, searchTerm, page }) => {
        const idField =
            filter?.group === ALL_ID ? 'id' : 'dimensionItem~rename(id)'
        const filters = ['domainType:eq:AGGREGATE']

        if (filter?.group && filter.group !== ALL_ID) {
            filters.push(`dataElementGroups.id:eq:${filter.group}`)
        }

        if (searchTerm) {
            filters.push(`${nameProp}:ilike:${searchTerm}`)
        }

        return {
            fields: `${idField},${nameProp}~rename(name),dimensionItemType`,
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
    params: ({ searchTerm, page, nameProp }) => {
        const filters = []

        if (searchTerm) {
            filters.push(`${nameProp}:ilike:${searchTerm}`)
        }

        return {
            fields: `id,${nameProp}~rename(name)`,
            order: `${nameProp}:asc`,
            filter: filters,
            paging: true,
            page,
        }
    },
}

export const dataElementOperandsQuery = {
    resource: 'dataElementOperands',
    params: ({ nameProp, filter, searchTerm, page }) => {
        const idField =
            filter?.group === ALL_ID ? 'id' : 'dimensionItem~rename(id)'
        const filters = []

        if (filter?.group && filter.group !== ALL_ID) {
            filters.push(`dataElement.dataElementGroups.id:eq:${filter.group}`)
        }

        if (searchTerm) {
            filters.push(`${nameProp}:ilike:${searchTerm}`)
        }

        return {
            fields: `${idField},${nameProp}~rename(name),dimensionItemType`,
            order: `${nameProp}:asc`,
            filter: filters,
            paging: true,
            page,
        }
    },
}

export const dataSetsQuery = {
    resource: 'dataSets',
    params: ({ nameProp, searchTerm, filter, page }) => {
        const filters = []

        if (searchTerm) {
            filters.push(`${nameProp}:ilike:${searchTerm}`)
        }

        if (filter?.group && filter.group !== ALL_ID) {
            filters.push(`id:eq:${filter.group}`)
        }

        const query = {
            fields: `dimensionItem~rename(id),${nameProp}~rename(name),dimensionItemType`,
            order: `${nameProp}:asc`,
            filter: filters,
            paging: false,
        }

        if (page) {
            query.page = page
            query.paging = true
        }

        return query
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
        (item) => item.id
    )
}

export const apiFetchOptions = ({
    dataEngine,
    nameProp,
    filter,
    searchTerm,
    page,
}) => {
    switch (filter?.dataType) {
        case INDICATOR: {
            return fetchIndicators({
                dataEngine,
                nameProp,
                filter,
                searchTerm,
                page,
            })
        }
        case DATA_ELEMENT: {
            if (filter.subGroup === TOTALS) {
                return fetchDataElements({
                    dataEngine,
                    nameProp,
                    filter,
                    searchTerm,
                    page,
                })
            } else {
                return fetchDataElementOperands({
                    dataEngine,
                    nameProp,
                    filter,
                    searchTerm,
                    page,
                })
            }
        }
        case DATA_SETS: {
            return fetchDataSets({
                dataEngine,
                nameProp,
                filter,
                searchTerm,
                page,
            })
        }
        default:
            return fetchDataItems({
                dataEngine,
                nameProp,
                filter,
                searchTerm,
                page,
            })
    }
}

export const apiFetchGroups = async (dataEngine, dataType, nameProp) => {
    // indicatorGroups does not support shortName
    const name = dataType === INDICATOR ? 'displayName' : nameProp

    switch (dataType) {
        case INDICATOR: {
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
        case DATA_ELEMENT: {
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
        case DATA_SETS: {
            const response = await dataEngine.query(
                { data: dataSetsQuery },
                {
                    variables: {
                        nameProp: name,
                    },
                    onError,
                }
            )
            return response.data.dataSets
        }
        case EVENT_DATA_ITEM:
        case PROGRAM_INDICATOR: {
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

const fetchIndicators = async ({
    dataEngine,
    nameProp,
    filter,
    searchTerm,
    page,
}) => {
    const indicatorsData = await dataEngine.query(
        { indicators: indicatorsQuery },
        {
            variables: {
                nameProp,
                filter,
                searchTerm,
                page,
            },
            onError,
        }
    )

    const response = indicatorsData.indicators

    return formatResponse(response.indicators, response.pager)
}

const fetchDataItems = async ({
    dataEngine,
    nameProp,
    filter,
    searchTerm,
    page,
}) => {
    const dataItemsData = await dataEngine.query(
        { dataItems: dataItemsQuery },
        {
            variables: {
                nameProp,
                filter,
                searchTerm,
                page,
            },
            onError,
        }
    )

    const response = dataItemsData.dataItems

    return formatResponse(response.dataItems, response.pager)
}

const formatResponse = (dimensionItems, pager) => ({
    dimensionItems,
    nextPage: pager.nextPage ? pager.page + 1 : null,
})

const fetchDataElements = async ({
    dataEngine,
    nameProp,
    filter,
    searchTerm,
    page,
}) => {
    const dataElementsData = await dataEngine.query(
        { dataElements: dataElementsQuery },
        {
            variables: {
                nameProp,
                filter,
                searchTerm,
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
    nameProp,
}) => {
    const itemsByDimensionData = await dataEngine.query(
        { itemsByDimensions: itemsByDimensionQuery },
        {
            variables: {
                id: dimensionId,
                searchTerm,
                page,
                nameProp,
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
    filter,
    searchTerm,
    page,
}) => {
    const dataElementOperandsData = await dataEngine.query(
        { dataElementOperands: dataElementOperandsQuery },
        {
            variables: {
                nameProp,
                filter,
                searchTerm,
                page,
            },
            onError,
        }
    )

    const response = dataElementOperandsData.dataElementOperands

    return formatResponse(response.dataElementOperands, response.pager)
}

const fetchDataSets = async ({
    dataEngine,
    nameProp,
    searchTerm,
    filter,
    page,
}) => {
    const dataSetsData = await dataEngine.query(
        { dataSets: dataSetsQuery },
        {
            variables: {
                nameProp,
                searchTerm,
                filter,
                page,
            },
            onError,
        }
    )

    const response = dataSetsData.dataSets

    return formatResponse(response.dataSets, response.pager)
}
