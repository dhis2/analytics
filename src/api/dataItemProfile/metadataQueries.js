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
            'id,aggregationType,aggregationLevels,valueType,domainType,dataSetElements[dataSet[id,periodType]]'
        ),
    },
    indicators: {
        resource: 'indicators',
        ...byIds('id,numerator,denominator,annualized'),
    },
    dataSets: {
        resource: 'dataSets',
        ...byIds('id,periodType'),
    },
    expressionDimensionItems: {
        resource: 'expressionDimensionItems',
        ...byIds('id,expression'),
    },
    programIndicators: {
        resource: 'programIndicators',
        ...byIds('id,program[id],orgUnitField,analyticsPeriodBoundaries[id]'),
    },
    programs: {
        resource: 'programs',
        ...byIds('id,programType'),
    },
}

export const METADATA_RESOURCES = Object.keys(dataItemProfileMetadataQueries)

// A period type comes as a name, or as an object on some versions
const getPeriodTypeName = (periodType) =>
    typeof periodType === 'string' ? periodType : periodType?.name

const getList = (response, resource) =>
    Array.isArray(response) ? response : response?.[resource] ?? []

// By id, or by period type when a version sends no id
const getDataSetKey = ({ id, periodType }) => id ?? periodType

const uniqueDataSets = (dataSets) =>
    dataSets.filter(
        (dataSet, i) =>
            dataSets.findIndex(
                (other) => getDataSetKey(other) === getDataSetKey(dataSet)
            ) === i
    )

const normalizers = {
    dataElements: ({
        aggregationType,
        aggregationLevels,
        valueType,
        domainType,
        dataSetElements,
    }) => ({
        aggregationType,
        ...(aggregationLevels?.length && { aggregationLevels }),
        valueType,
        domainType,
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
    indicators: ({ numerator, denominator, annualized }) => ({
        numerator,
        denominator,
        annualized,
    }),
    dataSets: ({ periodType }) => ({
        periodType: getPeriodTypeName(periodType),
    }),
    expressionDimensionItems: ({ expression }) => ({ expression }),
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
    programs: ({ programType }) => ({ programType }),
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
