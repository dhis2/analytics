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
} from '../../dataTypes.js'
import {
    DIMENSION_TYPE_REPORTING_RATE,
    NOT_AGGREGATABLE_AGGREGATION_TYPES,
    OPERAND_TYPE_UNKNOWN,
    PROFILE_REASON_MISSING_METADATA,
    PROFILE_REASON_MISSING_PROGRAM,
    PROFILE_REASON_NO_DATA_SET,
    PROFILE_REASON_NOT_AGGREGATABLE,
    PROFILE_REASON_UNKNOWN_OPERAND,
    PROFILE_REASON_UNSUPPORTED_ITEM_TYPE,
} from '../constants.js'
import { parseExpressionOperands } from '../expressionOperands.js'
import {
    addElementToSource,
    addReason,
    checkDataSetPeriodType,
    createCollector,
    getDataSetSource,
    getProgramSource,
    getUnassignedElementSource,
} from './sourceCollector.js'

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

const addDataElement = (
    collector,
    metadata,
    { id, operand, aggregationType: aggregationTypeOverride }
) => {
    const dataElement = metadata.dataElements?.[id]

    if (!dataElement) {
        addReason(collector, { code: PROFILE_REASON_MISSING_METADATA, id })
        return
    }

    const aggregationType =
        aggregationTypeOverride ?? dataElement.aggregationType
    const dataSets = dataElement.dataSets ?? []
    /* `operand`: the disaggregation analytics is asked for (de.coc), if any.
     * `aggregationLevels`: the org unit levels values from lower levels stop at */
    const element = {
        id,
        ...(operand && { operand }),
        aggregationType,
        periodAggregationType: getPeriodAggregationType(aggregationType),
        ...(dataElement.aggregationLevels?.length && {
            aggregationLevels: dataElement.aggregationLevels,
        }),
    }

    if (NOT_AGGREGATABLE_AGGREGATION_TYPES.has(aggregationType)) {
        addReason(collector, { code: PROFILE_REASON_NOT_AGGREGATABLE, id })
    }

    if (!dataSets.length) {
        addReason(collector, { code: PROFILE_REASON_NO_DATA_SET, id })
        addElementToSource(getUnassignedElementSource(collector, id), element)
    }

    dataSets.forEach((dataSet) => {
        checkDataSetPeriodType(collector, id, dataSet.periodType)
        addElementToSource(getDataSetSource(collector, dataSet), element)
    })
}

const addReportingRate = (collector, metadata, dataSetId) => {
    const periodType = metadata.dataSets?.[dataSetId]?.periodType

    if (!periodType) {
        addReason(collector, {
            code: PROFILE_REASON_MISSING_METADATA,
            id: dataSetId,
        })
        return
    }

    checkDataSetPeriodType(collector, dataSetId, periodType)
    getDataSetSource(collector, {
        id: dataSetId,
        periodType,
    }).reportingRate = true
}

const addProgramIndicator = (collector, metadata, id) => {
    const programIndicator = metadata.programIndicators?.[id]

    if (!programIndicator?.program) {
        addReason(collector, { code: PROFILE_REASON_MISSING_METADATA, id })
        return
    }

    getProgramSource(collector, metadata, {
        id: programIndicator.program,
        orgUnitField: programIndicator.orgUnitField,
        missingPeriodBoundaries: programIndicator.hasPeriodBoundaries === false,
    })
}

// An event or tracker item named by its program: program.element, program.attribute…
const addProgramItem = (collector, metadata, id) => {
    if (!id.includes('.')) {
        addReason(collector, { code: PROFILE_REASON_MISSING_PROGRAM, id })
        return
    }

    getProgramSource(collector, metadata, { id: id.split('.')[0] })
}

const addExpression = (collector, metadata, expression) =>
    parseExpressionOperands(expression).forEach((operand) => {
        switch (operand.type) {
            case DIMENSION_TYPE_DATA_ELEMENT:
                addDataElement(collector, metadata, operand)
                break
            case DIMENSION_TYPE_REPORTING_RATE:
                addReportingRate(collector, metadata, operand.id)
                break
            case DIMENSION_TYPE_INDICATOR:
                addIndicator(collector, metadata, operand.id)
                break
            case DIMENSION_TYPE_PROGRAM_INDICATOR:
                addProgramIndicator(collector, metadata, operand.id)
                break
            case DIMENSION_TYPE_PROGRAM_DATA_ELEMENT:
            case DIMENSION_TYPE_PROGRAM_ATTRIBUTE:
                addProgramItem(collector, metadata, operand.id)
                break
            case OPERAND_TYPE_UNKNOWN:
                addReason(collector, {
                    code: PROFILE_REASON_UNKNOWN_OPERAND,
                    token: operand.token,
                })
                break
            default:
            // Constants, org unit groups and [days] have no source
        }
    })

const addIndicator = (collector, metadata, id) => {
    // Nested indicators (N{}) can refer to each other
    if (collector.visitedIndicators.has(id)) {
        return
    }
    collector.visitedIndicators.add(id)

    const indicator = metadata.indicators?.[id]

    if (!indicator) {
        addReason(collector, { code: PROFILE_REASON_MISSING_METADATA, id })
        return
    }

    addExpression(collector, metadata, indicator.numerator)
    addExpression(collector, metadata, indicator.denominator)
}

const addExpressionDimensionItem = (collector, metadata, id) => {
    const expression = metadata.expressionDimensionItems?.[id]?.expression

    if (expression === undefined) {
        addReason(collector, { code: PROFILE_REASON_MISSING_METADATA, id })
        return
    }

    addExpression(collector, metadata, expression)
}

/**
 * The sources of a data item ({ id, dimensionItemType }), from its metadata
 * (fetchDataItemProfileMetadata), with the reasons the profile can't be told
 * or should note.
 */
export const collectSources = ({ id, dimensionItemType }, metadata) => {
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
            addReportingRate(collector, metadata, id.split('.')[0])
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
        case DIMENSION_TYPE_PROGRAM_DATA_ELEMENT:
        case DIMENSION_TYPE_PROGRAM_DATA_ELEMENT_OPTION:
        case DIMENSION_TYPE_PROGRAM_ATTRIBUTE:
        case DIMENSION_TYPE_PROGRAM_ATTRIBUTE_OPTION:
        case DIMENSION_TYPE_EVENT_DATA_ITEM:
            addProgramItem(collector, metadata, id)
            break
        default:
            addReason(collector, {
                code: PROFILE_REASON_UNSUPPORTED_ITEM_TYPE,
                id,
                dimensionItemType,
            })
    }

    return {
        sources: [...collector.sources.values()],
        reasons: collector.reasons,
    }
}
