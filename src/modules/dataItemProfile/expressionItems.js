export const OPERAND_DATA_ELEMENT = 'DATA_ELEMENT'
export const OPERAND_REPORTING_RATE = 'REPORTING_RATE'
export const OPERAND_INDICATOR = 'INDICATOR'
export const OPERAND_PROGRAM_INDICATOR = 'PROGRAM_INDICATOR'
export const OPERAND_PROGRAM_DATA_ELEMENT = 'PROGRAM_DATA_ELEMENT'
export const OPERAND_PROGRAM_ATTRIBUTE = 'PROGRAM_ATTRIBUTE'
export const OPERAND_CONSTANT = 'CONSTANT'
export const OPERAND_ORG_UNIT_GROUP = 'ORG_UNIT_GROUP'
export const OPERAND_DAYS = 'DAYS'
export const OPERAND_UNKNOWN = 'UNKNOWN'

const OPERAND_BY_PREFIX = {
    '#': OPERAND_DATA_ELEMENT,
    R: OPERAND_REPORTING_RATE,
    N: OPERAND_INDICATOR,
    I: OPERAND_PROGRAM_INDICATOR,
    D: OPERAND_PROGRAM_DATA_ELEMENT,
    A: OPERAND_PROGRAM_ATTRIBUTE,
    C: OPERAND_CONSTANT,
    OUG: OPERAND_ORG_UNIT_GROUP,
}

// Operands whose value depends on data collected in periods
export const PERIOD_LIMITING_OPERANDS = [
    OPERAND_DATA_ELEMENT,
    OPERAND_REPORTING_RATE,
    OPERAND_INDICATOR,
]

/* An operand (`#{de.coc}`, `R{ds.REPORTING_RATE}`, `[days]`…) and the
 * functions chained after it (`.periodOffset(-1)`, `.aggregationType(LAST)`) */
const OPERAND_REGEX =
    /(?:(#|[A-Z]+)\{([^}]*)\}|\[days\])((?:\.[a-zA-Z]+\([^)]*\))*)/g
const FUNCTION_REGEX = /\.([a-zA-Z]+)\(([^)]*)\)/g

const parseFunctions = (chain) =>
    [...chain.matchAll(FUNCTION_REGEX)].map(([, name, arg]) => ({
        name,
        arg: arg.trim(),
    }))

// The id of the object behind the operand: `de` in `#{de.coc.aoc}`, `ds` in `R{ds.METRIC}`
const getObjectId = (type, content) =>
    [OPERAND_DATA_ELEMENT, OPERAND_REPORTING_RATE].includes(type)
        ? content.split('.')[0]
        : content

const toOperand = ([token, prefix, content, chain]) => {
    const functions = parseFunctions(chain)
    const aggregationType = functions.find(
        ({ name }) => name === 'aggregationType'
    )?.arg

    if (prefix === undefined) {
        return { type: OPERAND_DAYS, token, functions }
    }

    const type = OPERAND_BY_PREFIX[prefix] ?? OPERAND_UNKNOWN
    // A disaggregation (de.coc, de.coc.aoc); a wildcard (de.*) is the whole element
    const isDisaggregation =
        type === OPERAND_DATA_ELEMENT &&
        content.includes('.') &&
        !content.includes('*')

    return {
        type,
        id: getObjectId(type, content),
        ...(isDisaggregation && { operand: content }),
        token,
        functions,
        ...(aggregationType && { aggregationType }),
    }
}

/**
 * Every operand of an indicator or expression dimension item expression, in
 * order, with the functions chained after it.
 */
export const getExpressionItems = (expression = '') =>
    [...(expression ?? '').matchAll(OPERAND_REGEX)].map(toOperand)
