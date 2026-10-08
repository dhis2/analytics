import { REPORTING_RATE } from '../../dataSets.js'
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
    NOT_AGGREGATABLE_AGGREGATION_TYPES,
    SKIP_IF_ALL_VALUES_MISSING,
    SKIP_IF_ANY_VALUE_MISSING,
    PERIOD_AGGREGATION_AVERAGE,
    PERIOD_AGGREGATION_FIRST,
    PERIOD_AGGREGATION_LAST,
    OPERAND_TYPE_UNKNOWN,
    PROFILE_REASON_MISSING_METADATA,
    PROFILE_REASON_MISSING_PROGRAM,
    PROFILE_REASON_NO_DATA_SET,
    PROFILE_REASON_NOT_AGGREGATABLE,
    PROFILE_REASON_UNKNOWN_OPERAND,
    PROFILE_REASON_UNSUPPORTED_ITEM_TYPE,
} from '../constants.js'
import {
    getCategoryOptionComboId,
    parseExpressionOperands,
} from '../expressionOperands.js'
import {
    getElementOperandKey,
    getProgramOperandKey,
    getReportingRateOperandKey,
} from '../sources.js'
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
    AVERAGE_SUM_ORG_UNIT: PERIOD_AGGREGATION_AVERAGE,
    LAST_AVERAGE_ORG_UNIT: PERIOD_AGGREGATION_LAST,
    LAST_LAST_ORG_UNIT: PERIOD_AGGREGATION_LAST,
    LAST_IN_PERIOD_AVERAGE_ORG_UNIT: 'LAST_IN_PERIOD',
    FIRST_AVERAGE_ORG_UNIT: PERIOD_AGGREGATION_FIRST,
    FIRST_FIRST_ORG_UNIT: PERIOD_AGGREGATION_FIRST,
    MAX_SUM_ORG_UNIT: 'MAX',
    MIN_SUM_ORG_UNIT: 'MIN',
}

export const getPeriodAggregationType = (aggregationType) =>
    PERIOD_AGGREGATION_BY_AGGREGATION_TYPE[aggregationType] ?? aggregationType

/* Each add* function adds the sources of an operand and gives its part of
 * the item's expression: `{ operand: key }` for an operand (sources.js keys),
 * `{ missingValueStrategy, parts }` for an expression, null when its metadata
 * is missing. */

const toPart = (key) => ({ operand: key })

/* A disaggregation (de.coc) is collected only by the data sets whose
 * category combo holds its option combo: others give the element another
 * combo. When either combo isn't known, every data set counts. */
const getCollectingDataSets = (dataSets, { operand, metadata }) => {
    const optionComboId = getCategoryOptionComboId(operand)
    const categoryComboId =
        optionComboId &&
        metadata.categoryOptionCombos?.[optionComboId]?.categoryComboId

    return categoryComboId
        ? dataSets.filter(
              (dataSet) =>
                  !dataSet.categoryComboId ||
                  dataSet.categoryComboId === categoryComboId
          )
        : dataSets
}

const addDataElement = (
    collector,
    metadata,
    { id, operand, aggregationType: aggregationTypeOverride }
) => {
    const dataElement = metadata.dataElements?.[id]

    if (!dataElement) {
        addReason(collector, { code: PROFILE_REASON_MISSING_METADATA, id })
        return null
    }

    const aggregationType =
        aggregationTypeOverride ?? dataElement.aggregationType
    const dataSets = getCollectingDataSets(dataElement.dataSets ?? [], {
        operand,
        metadata,
    })
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

    return toPart(getElementOperandKey(element))
}

const addReportingRate = (collector, metadata, dataSetId) => {
    const periodType = metadata.dataSets?.[dataSetId]?.periodType

    if (!periodType) {
        addReason(collector, {
            code: PROFILE_REASON_MISSING_METADATA,
            id: dataSetId,
        })
        return null
    }

    checkDataSetPeriodType(collector, dataSetId, periodType)
    getDataSetSource(collector, {
        id: dataSetId,
        periodType,
    }).reportingRate = true

    return toPart(getReportingRateOperandKey(dataSetId))
}

const toProgramPart = (source) =>
    source ? toPart(getProgramOperandKey(source)) : null

const addProgramIndicator = (collector, metadata, id) => {
    const programIndicator = metadata.programIndicators?.[id]

    if (!programIndicator?.program) {
        addReason(collector, { code: PROFILE_REASON_MISSING_METADATA, id })
        return null
    }

    return toProgramPart(
        getProgramSource(collector, metadata, {
            id: programIndicator.program,
            orgUnitField: programIndicator.orgUnitField,
            missingPeriodBoundaries:
                programIndicator.hasPeriodBoundaries === false,
        })
    )
}

// An event or tracker item named by its program: program.element, program.attribute…
const addProgramItem = (collector, metadata, id) => {
    if (!id.includes('.')) {
        addReason(collector, { code: PROFILE_REASON_MISSING_PROGRAM, id })
        return null
    }

    return toProgramPart(
        getProgramSource(collector, metadata, { id: id.split('.')[0] })
    )
}

const addOperand = (collector, metadata, operand) => {
    switch (operand.type) {
        case DIMENSION_TYPE_DATA_ELEMENT:
            return addDataElement(collector, metadata, operand)
        case REPORTING_RATE:
            return addReportingRate(collector, metadata, operand.id)
        case DIMENSION_TYPE_INDICATOR:
            return addIndicator(collector, metadata, operand.id)
        case DIMENSION_TYPE_PROGRAM_INDICATOR:
            return addProgramIndicator(collector, metadata, operand.id)
        case DIMENSION_TYPE_PROGRAM_DATA_ELEMENT:
        case DIMENSION_TYPE_PROGRAM_ATTRIBUTE:
            return addProgramItem(collector, metadata, operand.id)
        case OPERAND_TYPE_UNKNOWN:
            addReason(collector, {
                code: PROFILE_REASON_UNKNOWN_OPERAND,
                token: operand.token,
            })
            return null
        default:
            // Constants, org unit groups and [days] have no source, and never miss
            return null
    }
}

const addExpression = (
    collector,
    metadata,
    { expression, missingValueStrategy }
) => ({
    missingValueStrategy,
    parts: parseExpressionOperands(expression)
        .map((operand) => addOperand(collector, metadata, operand))
        .filter(Boolean),
})

// Each side skips only when all its values are missing; the indicator needs both
const addIndicator = (collector, metadata, id) => {
    const indicator = metadata.indicators?.[id]

    if (!indicator) {
        addReason(collector, { code: PROFILE_REASON_MISSING_METADATA, id })
        return null
    }

    // Nested indicators (N{}) can refer to each other, which analytics refuses
    if (collector.indicatorsInProgress.has(id)) {
        return null
    }

    collector.indicatorsInProgress.add(id)

    const sides = [indicator.numerator, indicator.denominator].map((side) =>
        addExpression(collector, metadata, {
            expression: side,
            missingValueStrategy: SKIP_IF_ALL_VALUES_MISSING,
        })
    )

    collector.indicatorsInProgress.delete(id)

    return { missingValueStrategy: SKIP_IF_ANY_VALUE_MISSING, parts: sides }
}

const addExpressionDimensionItem = (collector, metadata, id) => {
    const { expression, missingValueStrategy } =
        metadata.expressionDimensionItems?.[id] ?? {}

    if (expression === undefined) {
        addReason(collector, { code: PROFILE_REASON_MISSING_METADATA, id })
        return null
    }

    return addExpression(collector, metadata, {
        expression,
        missingValueStrategy:
            missingValueStrategy ?? SKIP_IF_ALL_VALUES_MISSING,
    })
}

const addItem = (collector, metadata, { id, dimensionItemType }) => {
    switch (dimensionItemType) {
        case DIMENSION_TYPE_DATA_ELEMENT:
        case DIMENSION_TYPE_DATA_ELEMENT_OPERAND:
            return addDataElement(collector, metadata, {
                id: id.split('.')[0],
                ...(id.includes('.') && { operand: id }),
            })
        case REPORTING_RATE:
            return addReportingRate(collector, metadata, id.split('.')[0])
        case DIMENSION_TYPE_INDICATOR:
            return addIndicator(collector, metadata, id)
        case DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM:
            return addExpressionDimensionItem(collector, metadata, id)
        case DIMENSION_TYPE_PROGRAM_INDICATOR:
            return addProgramIndicator(collector, metadata, id)
        case DIMENSION_TYPE_PROGRAM_DATA_ELEMENT:
        case DIMENSION_TYPE_PROGRAM_DATA_ELEMENT_OPTION:
        case DIMENSION_TYPE_PROGRAM_ATTRIBUTE:
        case DIMENSION_TYPE_PROGRAM_ATTRIBUTE_OPTION:
        case DIMENSION_TYPE_EVENT_DATA_ITEM:
            return addProgramItem(collector, metadata, id)
        default:
            addReason(collector, {
                code: PROFILE_REASON_UNSUPPORTED_ITEM_TYPE,
                id,
                dimensionItemType,
            })
            return null
    }
}

/**
 * The sources of a data item ({ id, dimensionItemType }), from its metadata
 * (fetchDataItemProfileMetadata), with the reasons the profile can't be told
 * or should note, and for an indicator or expression dimension item its
 * `expression`: how its operands combine.
 */
export const collectSources = (item, metadata) => {
    const collector = createCollector()
    const part = addItem(collector, metadata, item)

    return {
        sources: [...collector.sources.values()],
        reasons: collector.reasons,
        ...(part?.parts && { expression: part }),
    }
}
