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
            'id,aggregationType,aggregationLevels,categoryCombo[id],dataSetElements[dataSet[id,periodType],categoryCombo[id]]'
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
        ...byIds('id,expression'),
    },
    programIndicators: {
        resource: 'programIndicators',
        ...byIds('id,program[id],orgUnitField,analyticsPeriodBoundaries[id]'),
    },
    programs: {
        resource: 'programs',
        ...byIds('id'),
    },
    categoryOptionCombos: {
        resource: 'categoryOptionCombos',
        ...byIds('id,categoryCombo[id]'),
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
    /* A data set can give an element another category combo than its own:
     * each data set keeps the one its values are entered with */
    dataElements: ({
        aggregationType,
        aggregationLevels,
        categoryCombo,
        dataSetElements,
    }) => ({
        aggregationType,
        ...(aggregationLevels?.length && { aggregationLevels }),
        dataSets: uniqueDataSets(
            (dataSetElements ?? [])
                .filter(({ dataSet }) => dataSet?.periodType)
                .map(({ dataSet, categoryCombo: dataSetCategoryCombo }) => {
                    const categoryComboId =
                        dataSetCategoryCombo?.id ?? categoryCombo?.id

                    return {
                        id: dataSet.id,
                        periodType: getPeriodTypeName(dataSet.periodType),
                        ...(categoryComboId && { categoryComboId }),
                    }
                })
        ),
    }),
    indicators: ({ numerator, denominator }) => ({ numerator, denominator }),
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
    programs: () => ({}),
    categoryOptionCombos: ({ categoryCombo }) => ({
        categoryComboId: categoryCombo?.id,
    }),
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
