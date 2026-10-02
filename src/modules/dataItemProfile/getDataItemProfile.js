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
} from '../dataTypes.js'
import {
    OPERAND_DATA_ELEMENT,
    OPERAND_INDICATOR,
    OPERAND_PROGRAM_ATTRIBUTE,
    OPERAND_PROGRAM_DATA_ELEMENT,
    OPERAND_PROGRAM_INDICATOR,
    OPERAND_REPORTING_RATE,
    OPERAND_UNKNOWN,
    getExpressionItems,
} from './expressionItems.js'
import { withOrgUnitSide } from './orgUnitSide.js'
import { aggregatesInto } from './periodTypeRelations.js'
import { PERIOD_TYPES, isPeriodType, sortPeriodTypes } from './periodTypes.js'
import { isBoundedOrgUnitField } from './sources.js'

export const DIMENSION_TYPE_REPORTING_RATE = 'REPORTING_RATE'

export const PERIOD_AGGREGATION_AVERAGE = 'AVERAGE'
export const PERIOD_AGGREGATION_FIRST = 'FIRST'
export const PERIOD_AGGREGATION_LAST = 'LAST'

/* How each aggregation type aggregates over time, when it differs from the
 * type itself (dhis2-core AnalyticsAggregationType.fromAggregationType) */
const PERIOD_AGGREGATION_BY_AGGREGATION_TYPE = {
    AVERAGE_SUM_ORG_UNIT: 'AVERAGE',
    LAST_AVERAGE_ORG_UNIT: 'LAST',
    LAST_LAST_ORG_UNIT: 'LAST',
    LAST_IN_PERIOD_AVERAGE_ORG_UNIT: 'LAST_IN_PERIOD',
    FIRST_AVERAGE_ORG_UNIT: 'FIRST',
    FIRST_FIRST_ORG_UNIT: 'FIRST',
    MAX_SUM_ORG_UNIT: 'MAX',
    MIN_SUM_ORG_UNIT: 'MIN',
}

export const getPeriodAggregationType = (aggregationType) =>
    PERIOD_AGGREGATION_BY_AGGREGATION_TYPE[aggregationType] ?? aggregationType

export const NOT_AGGREGATABLE_AGGREGATION_TYPES = ['NONE']

export const REASON_MISSING_METADATA = 'MISSING_METADATA'
export const REASON_NO_DATA_SET = 'NO_DATA_SET'
export const REASON_NOT_AGGREGATABLE = 'NOT_AGGREGATABLE'
export const REASON_UNKNOWN_OPERAND = 'UNKNOWN_OPERAND'
export const REASON_UNKNOWN_PERIOD_TYPE = 'UNKNOWN_PERIOD_TYPE'
export const REASON_UNSUPPORTED_ITEM_TYPE = 'UNSUPPORTED_ITEM_TYPE'

/* Event and tracker items named by their program and an element or
 * attribute: program.element, program.element.option */
const PROGRAM_PREFIXED_ITEM_TYPES = [
    DIMENSION_TYPE_PROGRAM_DATA_ELEMENT,
    DIMENSION_TYPE_PROGRAM_DATA_ELEMENT_OPTION,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE_OPTION,
    DIMENSION_TYPE_EVENT_DATA_ITEM,
]

const createCollector = () => ({
    sources: new Map(),
    reasons: [],
    visited: new Set(),
})

const checkPeriodType = (collector, id, periodType) => {
    if (!isPeriodType(periodType)) {
        collector.reasons.push({
            code: REASON_UNKNOWN_PERIOD_TYPE,
            id,
            periodType,
        })
    }
}

// One source per data set; an element in no data set gets a source of its own
const getSource = (collector, dataSet, elementId) => {
    const key = dataSet
        ? `dataSet:${dataSet.id ?? dataSet.periodType}`
        : `element:${elementId}`

    if (!collector.sources.has(key)) {
        collector.sources.set(key, {
            dataSet: dataSet
                ? { id: dataSet.id, periodType: dataSet.periodType }
                : null,
            elements: [],
            reportingRate: false,
        })
    }

    return collector.sources.get(key)
}

const addElementToSource = (source, element) => {
    const isListed = source.elements.some(
        ({ id, operand, aggregationType }) =>
            id === element.id &&
            operand === element.operand &&
            aggregationType === element.aggregationType
    )

    if (!isListed) {
        source.elements.push(element)
    }
}

const addDataElement = (
    collector,
    metadata,
    { id, operand, aggregationType: aggregationTypeOverride }
) => {
    const dataElement = metadata.dataElements?.[id]

    if (!dataElement) {
        collector.reasons.push({ code: REASON_MISSING_METADATA, id })
        return
    }

    const aggregationType =
        aggregationTypeOverride ?? dataElement.aggregationType
    const dataSets = dataElement.dataSets ?? []
    /* `operand`: the disaggregation analytics is asked for (de.coc), if any.
     * `aggregationLevels`: the org unit levels values entered below stop at */
    const element = {
        id,
        ...(operand && { operand }),
        aggregationType,
        periodAggregationType: getPeriodAggregationType(aggregationType),
        ...(dataElement.aggregationLevels?.length && {
            aggregationLevels: dataElement.aggregationLevels,
        }),
    }

    if (NOT_AGGREGATABLE_AGGREGATION_TYPES.includes(aggregationType)) {
        collector.reasons.push({ code: REASON_NOT_AGGREGATABLE, id })
    }

    if (!dataSets.length) {
        collector.reasons.push({ code: REASON_NO_DATA_SET, id })
        addElementToSource(getSource(collector, null, id), element)
    }

    dataSets.forEach((dataSet) => {
        checkPeriodType(collector, id, dataSet.periodType)
        addElementToSource(getSource(collector, dataSet), element)
    })
}

/* A program is a source of its own: events and enrollments are placed by
 * their own dates, so it has no period type, and by the org units it's
 * assigned to */
const addProgram = (collector, metadata, { id, orgUnitField }) => {
    if (!metadata.programs?.[id]) {
        collector.reasons.push({ code: REASON_MISSING_METADATA, id })
        return
    }

    // Values placed by another org unit than the program's are a source of their own
    const placedAnywhere = !isBoundedOrgUnitField(orgUnitField)
    const key = placedAnywhere
        ? `program:${id}:${orgUnitField}`
        : `program:${id}`

    if (!collector.sources.has(key)) {
        collector.sources.set(key, {
            dataSet: null,
            program: { id },
            ...(placedAnywhere && { orgUnitField }),
            elements: [],
            reportingRate: false,
        })
    }
}

const addProgramIndicator = (collector, metadata, id) => {
    const { program, orgUnitField } = metadata.programIndicators?.[id] ?? {}

    if (!program) {
        collector.reasons.push({ code: REASON_MISSING_METADATA, id })
        return
    }

    addProgram(collector, metadata, { id: program, orgUnitField })
}

// The program of program.element or program.attribute, if the id names one
const addPrefixedProgram = (collector, metadata, id) => {
    if (id.includes('.')) {
        addProgram(collector, metadata, { id: id.split('.')[0] })
    }
}

const addDataSet = (collector, metadata, id) => {
    const periodType = metadata.dataSets?.[id]?.periodType

    if (!periodType) {
        collector.reasons.push({ code: REASON_MISSING_METADATA, id })
        return
    }

    checkPeriodType(collector, id, periodType)
    getSource(collector, { id, periodType }).reportingRate = true
}

const addExpression = (collector, metadata, expression) => {
    getExpressionItems(expression).forEach((operand) => {
        switch (operand.type) {
            case OPERAND_DATA_ELEMENT:
                addDataElement(collector, metadata, operand)
                break
            case OPERAND_REPORTING_RATE:
                addDataSet(collector, metadata, operand.id)
                break
            case OPERAND_INDICATOR:
                addIndicator(collector, metadata, operand.id)
                break
            case OPERAND_PROGRAM_INDICATOR:
                addProgramIndicator(collector, metadata, operand.id)
                break
            case OPERAND_PROGRAM_DATA_ELEMENT:
            case OPERAND_PROGRAM_ATTRIBUTE:
                addPrefixedProgram(collector, metadata, operand.id)
                break
            case OPERAND_UNKNOWN:
                collector.reasons.push({
                    code: REASON_UNKNOWN_OPERAND,
                    token: operand.token,
                })
                break
            default:
            // Constants, org unit groups and days have no source
        }
    })
}

const addIndicator = (collector, metadata, id) => {
    // Nested indicators (N{}) can refer to each other
    if (collector.visited.has(id)) {
        return
    }
    collector.visited.add(id)

    const indicator = metadata.indicators?.[id]

    if (!indicator) {
        collector.reasons.push({ code: REASON_MISSING_METADATA, id })
        return
    }

    addExpression(collector, metadata, indicator.numerator)
    addExpression(collector, metadata, indicator.denominator)
}

const addExpressionDimensionItem = (collector, metadata, id) => {
    const expression = metadata.expressionDimensionItems?.[id]?.expression

    if (expression === undefined) {
        collector.reasons.push({ code: REASON_MISSING_METADATA, id })
        return
    }

    addExpression(collector, metadata, expression)
}

const collectSources = ({ id, dimensionItemType }, metadata) => {
    const collector = createCollector()

    switch (dimensionItemType) {
        case DIMENSION_TYPE_DATA_ELEMENT:
        case DIMENSION_TYPE_DATA_ELEMENT_OPERAND:
            addDataElement(collector, metadata, {
                id: id.split('.')[0],
                ...(id.includes('.') && { operand: id }),
            })
            break
        case DIMENSION_TYPE_REPORTING_RATE:
            addDataSet(collector, metadata, id.split('.')[0])
            break
        case DIMENSION_TYPE_INDICATOR:
            addIndicator(collector, metadata, id)
            break
        case DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM:
            addExpressionDimensionItem(collector, metadata, id)
            break
        case DIMENSION_TYPE_PROGRAM_INDICATOR:
            addProgramIndicator(collector, metadata, id)
            break
        default:
            if (PROGRAM_PREFIXED_ITEM_TYPES.includes(dimensionItemType)) {
                addPrefixedProgram(collector, metadata, id)
            } else {
                collector.reasons.push({
                    code: REASON_UNSUPPORTED_ITEM_TYPE,
                    id,
                    dimensionItemType,
                })
            }
    }

    return collector
}

/* The shortest query type that every type aggregates into: the longest of
 * them when they nest, the next type up when two have the same order (Monday
 * and Wednesday weeks: BiWeekly) */
const getFinestQueryPeriodType = (periodTypes) =>
    sortPeriodTypes(PERIOD_TYPES).find((queryPeriodType) =>
        periodTypes.every((periodType) =>
            aggregatesInto(periodType, queryPeriodType)
        )
    ) ?? null

const unique = (values) => [...new Set(values)]

// Averaged values are repeated into any period: they never go missing
export const isAveraged = ({ periodAggregationType }) =>
    periodAggregationType === PERIOD_AGGREGATION_AVERAGE

// The source's period type, or null when it has no data set or an unknown type
export const getSourcePeriodType = ({ dataSet }) =>
    isPeriodType(dataSet?.periodType) ? dataSet.periodType : null

const getPeriodTypes = (sources) =>
    sortPeriodTypes(unique(sources.map(getSourcePeriodType).filter(Boolean)))

/* The profile's period side. `finest` is the shortest type at which every
 * value is measured directly: shorter ones get averaged or carried values, or
 * none (see getDataItemProfileCompatibility). */
export const getPeriodSide = (sources) => {
    const types = getPeriodTypes(sources)

    return {
        types,
        finest: types.length ? getFinestQueryPeriodType(types) : null,
        mixed: types.length > 1,
    }
}

/**
 * The profile of a data item, from its metadata: how and where it is
 * collected. `sources` has one entry per data set it is collected in, with
 * the item's elements in it (a reporting rate is its data set). The `period`
 * side says which period types they are collected at, and `period.finest`
 * the shortest type at which every value is measured directly, or null when
 * nothing is collected by period (event data). Missing metadata makes the
 * item `unknown`, with the `reasons`; it is never guessed.
 *
 * With the data sets' assigned units per level in the metadata
 * (`dataSetOrgUnitLevels`, fetched by default), the profile also has an
 * `orgUnit` side: the levels its data sets are assigned at (withOrgUnitSide).
 */
export const getDataItemProfile = (item, metadata = {}) => {
    const collector = collectSources(item, metadata)
    const sources = [...collector.sources.values()]
    const profile = {
        sources,
        unknown: collector.reasons.length > 0,
        reasons: collector.reasons,
        period: getPeriodSide(sources),
    }

    return metadata.dataSetOrgUnitLevels
        ? withOrgUnitSide(profile, metadata.dataSetOrgUnitLevels)
        : profile
}
