import {
    getCategoryOptionComboId,
    parseExpressionOperands,
} from '../../modules/dataItemProfile/expressionOperands.js'
import { REPORTING_RATE } from '../../modules/dataSets.js'
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

// The category option combo of a disaggregation, to tell which data sets collect it
const addCategoryOptionCombo = (pending, operand) => {
    const id = getCategoryOptionComboId(operand)

    if (id) {
        pending.categoryOptionCombos.add(id)
    }
}

const addItem = (pending, { id, dimensionItemType }) => {
    switch (dimensionItemType) {
        case DIMENSION_TYPE_DATA_ELEMENT:
        case DIMENSION_TYPE_DATA_ELEMENT_OPERAND:
            pending.dataElements.add(id.split('.')[0])
            addCategoryOptionCombo(pending, id)
            break
        case REPORTING_RATE:
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
    [REPORTING_RATE]: 'dataSets',
    [DIMENSION_TYPE_INDICATOR]: 'indicators',
    [DIMENSION_TYPE_PROGRAM_INDICATOR]: 'programIndicators',
}

const PROGRAM_ITEM_OPERAND_TYPES = new Set([
    DIMENSION_TYPE_PROGRAM_DATA_ELEMENT,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
])

const addOperands = (pending, expression) =>
    parseExpressionOperands(expression).forEach(({ type, id, operand }) => {
        const resource = RESOURCE_BY_OPERAND_TYPE[type]

        if (resource) {
            pending[resource].add(id)
            addCategoryOptionCombo(pending, operand)
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
const fetchRound = async (
    dataEngine,
    { metadata, pending, requested, signal }
) => {
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
                { variables: { ids }, signal }
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
        signal,
    })
}

// What `known` metadata already holds counts as requested
const getRequested = (known) =>
    Object.fromEntries(
        METADATA_RESOURCES.map((resource) => [
            resource,
            new Set(Object.keys(known?.[resource] ?? {})),
        ])
    )

/**
 * Fetches the metadata getDataItemProfile needs for `items`
 * ({ id, dimensionItemType }): data elements, data sets, indicators and their
 * operands, nested indicators, expression dimension items, program
 * indicators and programs. `known`, metadata fetched before, is reused: only
 * what it lacks is fetched. `signal` cancels the requests. Where data sets
 * and programs are assigned is fetched apart (fetchOrgUnitCoverage), only
 * when org units are asked.
 */
export const fetchDataItemProfileMetadata = async (
    dataEngine,
    items = [],
    { known, signal } = {}
) => {
    const pending = createPending()

    items.forEach((item) => addItem(pending, item))

    return fetchRound(dataEngine, {
        metadata: mergeMetadata(
            normalizeDataItemProfileMetadata(),
            known ?? {}
        ),
        pending,
        requested: getRequested(known),
        signal,
    })
}
