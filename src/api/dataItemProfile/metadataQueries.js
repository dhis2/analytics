const byIds = (fields) => ({
    params: ({ ids }) => ({
        fields,
        filter: `id:in:[${ids.join(',')}]`,
        paging: false,
    }),
})

export const dataItemProfileMetadataQueries = {
    dataElements: {
        resource: 'dataElements',
        ...byIds(
            'id,aggregationType,aggregationLevels,dataSetElements[dataSet[id,periodType]]'
        ),
    },
    indicators: {
        resource: 'indicators',
        ...byIds('id,numerator,denominator'),
    },
    dataSets: {
        resource: 'dataSets',
        ...byIds('id,periodType'),
    },
    expressionDimensionItems: {
        resource: 'expressionDimensionItems',
        ...byIds('id,expression,missingValueStrategy'),
    },
    programIndicators: {
        resource: 'programIndicators',
        ...byIds('id,program[id],orgUnitField,analyticsPeriodBoundaries[id]'),
    },
    programs: {
        resource: 'programs',
        ...byIds('id'),
    },
}

export const METADATA_RESOURCES = Object.keys(dataItemProfileMetadataQueries)

// A period type comes as a name, or as an object on some versions
const getPeriodTypeName = (periodType) =>
    typeof periodType === 'string' ? periodType : periodType?.name

const getList = (response, resource) =>
    Array.isArray(response) ? response : response?.[resource] ?? []

const uniqueDataSets = (dataSets) => [
    ...new Map(dataSets.map((dataSet) => [dataSet.id, dataSet])).values(),
]

const normalizers = {
    dataElements: ({
        aggregationType,
        aggregationLevels,
        dataSetElements,
    }) => ({
        aggregationType,
        ...(aggregationLevels?.length && { aggregationLevels }),
        dataSets: uniqueDataSets(
            (dataSetElements ?? [])
                .map(({ dataSet }) => dataSet)
                .filter((dataSet) => dataSet?.periodType)
                .map(({ id, periodType }) => ({
                    id,
                    periodType: getPeriodTypeName(periodType),
                }))
        ),
    }),
    indicators: ({ numerator, denominator }) => ({ numerator, denominator }),
    dataSets: ({ periodType }) => ({
        periodType: getPeriodTypeName(periodType),
    }),
    expressionDimensionItems: ({ expression, missingValueStrategy }) => ({
        expression,
        ...(missingValueStrategy && { missingValueStrategy }),
    }),
    programIndicators: ({
        program,
        orgUnitField,
        analyticsPeriodBoundaries,
    }) => ({
        program: program?.id,
        ...(orgUnitField && { orgUnitField }),
        ...(analyticsPeriodBoundaries && {
            hasPeriodBoundaries: analyticsPeriodBoundaries.length > 0,
        }),
    }),
    programs: () => ({}),
}

/**
 * The lookups getDataItemProfile reads, by resource and id, from the
 * responses of dataItemProfileMetadataQueries. Accepts a gist response and
 * period types as objects.
 */
export const normalizeDataItemProfileMetadata = (responses = {}) =>
    Object.fromEntries(
        METADATA_RESOURCES.map((resource) => [
            resource,
            Object.fromEntries(
                getList(responses[resource], resource).map((object) => [
                    object.id,
                    normalizers[resource](object),
                ])
            ),
        ])
    )
