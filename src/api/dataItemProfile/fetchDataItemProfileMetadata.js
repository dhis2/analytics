import { DIMENSION_TYPE_REPORTING_RATE } from '../../modules/dataItemProfile/constants.js'
import { parseExpressionOperands } from '../../modules/dataItemProfile/expressionOperands.js'
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
} from '../../modules/dataTypes.js'
import { fetchAssignedOrgUnitCounts } from './assignedOrgUnitCounts.js'
import {
    dataItemProfileMetadataQueries,
    METADATA_RESOURCES,
    normalizeDataItemProfileMetadata,
} from './metadataQueries.js'

const createPending = () =>
    Object.fromEntries(
        METADATA_RESOURCES.map((resource) => [resource, new Set()])
    )

// The program of program.element or program.attribute, if the id names one
const addProgramOfItem = (pending, id) => {
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
            addProgramOfItem(pending, id)
            break
        default:
        // Other items need no metadata
    }
}

const RESOURCE_BY_OPERAND_TYPE = {
    [DIMENSION_TYPE_DATA_ELEMENT]: 'dataElements',
    [DIMENSION_TYPE_REPORTING_RATE]: 'dataSets',
    [DIMENSION_TYPE_INDICATOR]: 'indicators',
    [DIMENSION_TYPE_PROGRAM_INDICATOR]: 'programIndicators',
}

const PROGRAM_ITEM_OPERAND_TYPES = new Set([
    DIMENSION_TYPE_PROGRAM_DATA_ELEMENT,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
])

const addOperands = (pending, expression) =>
    parseExpressionOperands(expression).forEach(({ type, id }) => {
        const resource = RESOURCE_BY_OPERAND_TYPE[type]

        if (resource) {
            pending[resource].add(id)
        } else if (PROGRAM_ITEM_OPERAND_TYPES.has(type)) {
            addProgramOfItem(pending, id)
        }
    })

// What the fetched objects refer to: operands of expressions, programs of program indicators
const getReferences = (fetched) => {
    const pending = createPending()

    Object.values(fetched.indicators).forEach(({ numerator, denominator }) => {
        addOperands(pending, numerator)
        addOperands(pending, denominator)
    })
    Object.values(fetched.expressionDimensionItems).forEach(({ expression }) =>
        addOperands(pending, expression)
    )
    Object.values(fetched.programIndicators).forEach(
        ({ program }) => program && pending.programs.add(program)
    )

    return pending
}

const mergeMetadata = (metadata, fetched) =>
    Object.fromEntries(
        METADATA_RESOURCES.map((resource) => [
            resource,
            { ...metadata[resource], ...fetched[resource] },
        ])
    )

/* One round: fetch what is pending and not fetched yet, then what it refers
 * to (indicators nest through N{}). Each id is fetched once, so the rounds
 * end when nothing new is referred to. */
const fetchRound = async (dataEngine, { metadata, pending, requested }) => {
    const toFetch = METADATA_RESOURCES.map((resource) => [
        resource,
        [...pending[resource]].filter((id) => !requested[resource].has(id)),
    ]).filter(([, ids]) => ids.length)

    if (!toFetch.length) {
        return metadata
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

    return fetchRound(dataEngine, {
        metadata: mergeMetadata(metadata, fetched),
        pending: getReferences(fetched),
        requested,
    })
}

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
 * indicators and programs. By default it also counts the org units each data
 * set and program is assigned to per level (fetchAssignedOrgUnitCounts), for
 * the profile's assigned org unit levels; `{ withAssignedOrgUnitCounts:
 * false }` leaves them out.
 */
export const fetchDataItemProfileMetadata = async (
    dataEngine,
    items = [],
    { withAssignedOrgUnitCounts = true } = {}
) => {
    const pending = createPending()

    items.forEach((item) => addItem(pending, item))

    const metadata = await fetchRound(dataEngine, {
        metadata: normalizeDataItemProfileMetadata(),
        pending,
        requested: createPending(),
    })

    if (!withAssignedOrgUnitCounts) {
        return metadata
    }

    const { levels, assignedOrgUnitCounts } = await fetchAssignedOrgUnitCounts(
        dataEngine,
        getSources(metadata)
    )

    return { ...metadata, orgUnitLevels: levels, assignedOrgUnitCounts }
}
