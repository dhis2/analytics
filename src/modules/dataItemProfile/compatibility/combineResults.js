import {
    COMPATIBILITY_FULL,
    COMPATIBILITY_NONE,
    COMPATIBILITY_PARTIAL,
    COMPATIBILITY_SEVERITY,
    COMPATIBILITY_UNKNOWN,
    REASON_OPERAND_EMPTY,
    REASON_OPERAND_PARTIAL,
    REASON_ORDER,
} from '../constants.js'

export const createResult = (status, reasons = []) => ({ status, reasons })

export const getUnknownResult = (reason) =>
    createResult(COMPATIBILITY_UNKNOWN, [reason])

// Every reason of the results, once each, in REASON_ORDER
export const unionOfReasons = (results) =>
    REASON_ORDER.filter((reason) =>
        results.some(({ reasons }) => reasons.includes(reason))
    )

// The result with the most severe status, or undefined for none
export const getMostSevere = (results) =>
    COMPATIBILITY_SEVERITY.map((status) =>
        results.find((result) => result.status === status)
    ).find(Boolean)

// The most severe status, with every reason; full for no results
export const combineResults = (results) =>
    createResult(
        getMostSevere(results)?.status ?? COMPATIBILITY_FULL,
        unionOfReasons(results)
    )

const OPERAND_REASON_BY_STATUS = {
    [COMPATIBILITY_NONE]: REASON_OPERAND_EMPTY,
    [COMPATIBILITY_PARTIAL]: REASON_OPERAND_PARTIAL,
}

/**
 * An expression's result, from its operands': the most severe decides, and
 * with more than one operand, a none or partial result says so first with
 * OPERAND_EMPTY or OPERAND_PARTIAL.
 */
export const combineOperandResults = (results) => {
    const combined = combineResults(results)
    const reason =
        results.length > 1 && OPERAND_REASON_BY_STATUS[combined.status]

    return reason
        ? { ...combined, reasons: [reason, ...combined.reasons] }
        : combined
}
