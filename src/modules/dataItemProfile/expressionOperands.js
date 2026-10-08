import { REPORTING_RATE } from '../dataSets.js'
import {
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_INDICATOR,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    DIMENSION_TYPE_PROGRAM_DATA_ELEMENT,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
} from '../dataTypes.js'
import {
    OPERAND_TYPE_CONSTANT,
    OPERAND_TYPE_DAYS,
    OPERAND_TYPE_ORG_UNIT_GROUP,
    OPERAND_TYPE_UNKNOWN,
} from './constants.js'

/* The full indicator and expression syntax (the library's parseExpression in
 * modules/expressions.js reads only the #{} of calculations) */
const OPERAND_TYPE_BY_PREFIX = {
    '#': DIMENSION_TYPE_DATA_ELEMENT,
    R: REPORTING_RATE,
    N: DIMENSION_TYPE_INDICATOR,
    I: DIMENSION_TYPE_PROGRAM_INDICATOR,
    D: DIMENSION_TYPE_PROGRAM_DATA_ELEMENT,
    A: DIMENSION_TYPE_PROGRAM_ATTRIBUTE,
    C: OPERAND_TYPE_CONSTANT,
    OUG: OPERAND_TYPE_ORG_UNIT_GROUP,
}

// An operand: `#{de.coc}`, `R{ds.REPORTING_RATE}`, `[days]`… (prefixes are 1 to 3 letters)
const OPERAND_REGEX = /(#|[A-Z]{1,3})\{([^}]*)\}|\[days\]/g
// One function chained after it: `.periodOffset(-1)`, `.aggregationType(LAST)`
const FUNCTION_REGEX = /\.([a-zA-Z]+)\(([^)]*)\)/y

// The functions chained at `position`, and where they end
const readFunctions = (expression, position) => {
    const functions = []

    FUNCTION_REGEX.lastIndex = position

    for (
        let match = FUNCTION_REGEX.exec(expression);
        match;
        match = FUNCTION_REGEX.exec(expression)
    ) {
        functions.push({ name: match[1], arg: match[2].trim() })
        position = FUNCTION_REGEX.lastIndex
    }

    return { functions, end: position }
}

/* The object to fetch for the operand: the data element of `#{de.coc.aoc}`,
 * the data set of `R{ds.REPORTING_RATE}`, the whole content otherwise */
const getOperandObjectId = (type, content) =>
    type === DIMENSION_TYPE_DATA_ELEMENT || type === REPORTING_RATE
        ? content.split('.')[0]
        : content

// One operand found by OPERAND_REGEX: its type, the object behind it, its token and functions
const toOperand = (expression, match) => {
    const [operandToken, prefix, content] = match
    const { functions, end } = readFunctions(
        expression,
        match.index + operandToken.length
    )
    const token = expression.slice(match.index, end)

    if (prefix === undefined) {
        return { type: OPERAND_TYPE_DAYS, token, functions }
    }

    const type = OPERAND_TYPE_BY_PREFIX[prefix] ?? OPERAND_TYPE_UNKNOWN
    // A disaggregation (de.coc, de.coc.aoc); a wildcard (de.*) is the whole element
    const isDisaggregation =
        type === DIMENSION_TYPE_DATA_ELEMENT &&
        content.includes('.') &&
        !content.includes('*')
    const aggregationType = functions.find(
        ({ name }) => name === 'aggregationType'
    )?.arg

    return {
        type,
        id: getOperandObjectId(type, content),
        ...(isDisaggregation && { operand: content }),
        token,
        functions,
        ...(aggregationType && { aggregationType }),
    }
}

/**
 * Every operand of an indicator or expression dimension item expression, in
 * order: its type (a dimension item type, or a constant, org unit group,
 * [days] or unknown operand), the id of the object behind it, and the
 * functions chained after it.
 */
export const parseExpressionOperands = (expression) =>
    [...(expression ?? '').matchAll(OPERAND_REGEX)].map((match) =>
        toOperand(expression, match)
    )

/**
 * The category option combo a disaggregation asks for (`de.coc`,
 * `de.coc.aoc`), or undefined for a whole element or a wildcard (`de.*`).
 */
export const getCategoryOptionComboId = (operand) => {
    const id = operand?.split('.')[1]

    return id && id !== '*' ? id : undefined
}
