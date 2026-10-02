import {
    OPERAND_DATA_ELEMENT,
    OPERAND_INDICATOR,
    OPERAND_PROGRAM_ATTRIBUTE,
    OPERAND_PROGRAM_DATA_ELEMENT,
    OPERAND_PROGRAM_INDICATOR,
    OPERAND_REPORTING_RATE,
    getExpressionItems,
} from '../modules/dataItemProfile/expressionItems.js'
import { DIMENSION_TYPE_REPORTING_RATE } from '../modules/dataItemProfile/getDataItemProfile.js'
import {
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_DATA_ELEMENT_OPERAND,
    DIMENSION_TYPE_EVENT_DATA_ITEM,
    DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM,
    DIMENSION_TYPE_INDICATOR,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE_OPTION,
    DIMENSION_TYPE_PROGRAM_DATA_ELEMENT,
    DIMENSION_TYPE_PROGRAM_DATA_ELEMENT_OPTION,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
} from '../modules/dataTypes.js'
import { fetchSourceOrgUnitLevels } from './orgUnitCoverage.js'

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
        ...byIds('id,program[id],orgUnitField'),
    },
    programs: {
        resource: 'programs',
        ...byIds('id,programType'),
    },
}

const RESOURCES = Object.keys(dataItemProfileMetadataQueries)

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
    programIndicators: ({ program, orgUnitField }) => ({
        program: program?.id,
        ...(orgUnitField && { orgUnitField }),
    }),
    programs: ({ programType }) => ({ programType }),
}

/**
 * The lookups getDataItemProfile reads, from the responses of
 * dataItemProfileMetadataQueries. Accepts a gist response and period types as
 * objects.
 */
export const normalizeDataItemProfileMetadata = (responses = {}) =>
    Object.fromEntries(
        RESOURCES.map((resource) => [
            resource,
            Object.fromEntries(
                getList(responses[resource], resource).map((object) => [
                    object.id,
                    normalizers[resource](object),
                ])
            ),
        ])
    )

const createPending = () =>
    Object.fromEntries(RESOURCES.map((resource) => [resource, new Set()]))

// The program of program.element or program.attribute, if the id names one
const addPrefixedProgram = (pending, id) => {
    if (id.includes('.')) {
        pending.programs.add(id.split('.')[0])
    }
}

const addItem = (pending, { id, dimensionItemType }) => {
    switch (dimensionItemType) {
        case DIMENSION_TYPE_DATA_ELEMENT:
        case DIMENSION_TYPE_DATA_ELEMENT_OPERAND:
            pending.dataElements.add(id.split('.')[0])
            break
        case DIMENSION_TYPE_REPORTING_RATE:
            pending.dataSets.add(id.split('.')[0])
            break
        case DIMENSION_TYPE_INDICATOR:
            pending.indicators.add(id)
            break
        case DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM:
            pending.expressionDimensionItems.add(id)
            break
        case DIMENSION_TYPE_PROGRAM_INDICATOR:
            pending.programIndicators.add(id)
            break
        case DIMENSION_TYPE_PROGRAM_DATA_ELEMENT:
        case DIMENSION_TYPE_PROGRAM_DATA_ELEMENT_OPTION:
        case DIMENSION_TYPE_PROGRAM_ATTRIBUTE:
        case DIMENSION_TYPE_PROGRAM_ATTRIBUTE_OPTION:
        case DIMENSION_TYPE_EVENT_DATA_ITEM:
            addPrefixedProgram(pending, id)
            break
        default:
        // Other items need no metadata
    }
}

const OPERAND_RESOURCE = {
    [OPERAND_DATA_ELEMENT]: 'dataElements',
    [OPERAND_REPORTING_RATE]: 'dataSets',
    [OPERAND_INDICATOR]: 'indicators',
    [OPERAND_PROGRAM_INDICATOR]: 'programIndicators',
}

const PROGRAM_PREFIXED_OPERANDS = [
    OPERAND_PROGRAM_DATA_ELEMENT,
    OPERAND_PROGRAM_ATTRIBUTE,
]

const addOperands = (pending, expression) =>
    getExpressionItems(expression).forEach(({ type, id }) => {
        const resource = OPERAND_RESOURCE[type]

        if (resource) {
            pending[resource].add(id)
        } else if (PROGRAM_PREFIXED_OPERANDS.includes(type)) {
            addPrefixedProgram(pending, id)
        }
    })

const mergeMetadata = (metadata, fetched) =>
    Object.fromEntries(
        RESOURCES.map((resource) => [
            resource,
            { ...metadata[resource], ...fetched[resource] },
        ])
    )

// Indicators can nest (N{}), so operands are fetched round by round
const MAX_ROUNDS = 10

// The data sets behind the metadata: of its data elements, and read as reporting rates
// The data sets and programs behind the metadata, as sources to count
const getSources = (metadata) => [
    ...[
        ...new Set([
            ...Object.values(metadata.dataElements).flatMap(({ dataSets }) =>
                dataSets.map(({ id }) => id).filter(Boolean)
            ),
            ...Object.keys(metadata.dataSets),
        ]),
    ].map((id) => ({ id, field: 'dataSets' })),
    ...Object.keys(metadata.programs).map((id) => ({ id, field: 'programs' })),
]

/**
 * Fetches the metadata getDataItemProfile needs for `items`
 * ({ id, dimensionItemType }): data elements, data sets, indicators and their
 * operands, nested indicators, expression dimension items, program
 * indicators and programs. By default it
 * also counts each data set's assigned units per level
 * (fetchSourceOrgUnitLevels: one count per data set or program and level), for the
 * profile's org unit side; `{ orgUnitLevels: false }` leaves them out.
 */
export const fetchDataItemProfileMetadata = async (
    dataEngine,
    items = [],
    { orgUnitLevels = true } = {}
) => {
    let metadata = normalizeDataItemProfileMetadata()
    const requested = createPending()
    let pending = createPending()

    items.forEach((item) => addItem(pending, item))

    for (let round = 0; round < MAX_ROUNDS; round++) {
        const toFetch = RESOURCES.map((resource) => [
            resource,
            [...pending[resource]].filter((id) => !requested[resource].has(id)),
        ]).filter(([, ids]) => ids.length)

        if (!toFetch.length) {
            break
        }

        const responses = await Promise.all(
            toFetch.map(([resource, ids]) => {
                ids.forEach((id) => requested[resource].add(id))

                return dataEngine.query(
                    { [resource]: dataItemProfileMetadataQueries[resource] },
                    { variables: { ids } }
                )
            })
        )
        const fetched = normalizeDataItemProfileMetadata(
            Object.assign({}, ...responses)
        )

        metadata = mergeMetadata(metadata, fetched)
        pending = createPending()
        Object.values(fetched.indicators).forEach(
            ({ numerator, denominator }) => {
                addOperands(pending, numerator)
                addOperands(pending, denominator)
            }
        )
        Object.values(fetched.expressionDimensionItems).forEach(
            ({ expression }) => addOperands(pending, expression)
        )
        Object.values(fetched.programIndicators).forEach(
            ({ program }) => program && pending.programs.add(program)
        )
    }

    if (!orgUnitLevels) {
        return metadata
    }

    const { levels, assignedLevels } = await fetchSourceOrgUnitLevels(
        dataEngine,
        getSources(metadata)
    )

    return {
        ...metadata,
        orgUnitLevels: levels,
        dataSetOrgUnitLevels: assignedLevels,
    }
}
