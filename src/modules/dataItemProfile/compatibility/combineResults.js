import {
    COMPATIBILITY_FULL,
    COMPATIBILITY_NONE,
    COMPATIBILITY_PARTIAL,
    COMPATIBILITY_SEVERITY,
    COMPATIBILITY_UNKNOWN,
    REASON_OPERAND_EMPTY,
    REASON_OPERAND_PARTIAL,
    REASON_ORDER,
    SKIP_IF_ANY_VALUE_MISSING,
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

const hasStatus =
    (...statuses) =>
    ({ status }) =>
        statuses.includes(status)

/**
 * Results whose values add up, such as a relative period over its fixed
 * periods, or a selection over its periods and org units: none when all are,
 * partial when some give values and others none or only some, otherwise the
 * most severe of the rest. When those without none are all unknown, so is
 * the result.
 */
export const combineAddedUpResults = (results) => {
    const reasons = unionOfReasons(results)
    const isNone = hasStatus(COMPATIBILITY_NONE)

    if (results.length && results.every(isNone)) {
        return createResult(COMPATIBILITY_NONE, reasons)
    }

    const givesValues = results.some(
        hasStatus(COMPATIBILITY_FULL, COMPATIBILITY_PARTIAL)
    )

    if (results.some(hasStatus(COMPATIBILITY_PARTIAL))) {
        return createResult(COMPATIBILITY_PARTIAL, reasons)
    }

    if (results.some(isNone)) {
        return createResult(
            givesValues ? COMPATIBILITY_PARTIAL : COMPATIBILITY_UNKNOWN,
            reasons
        )
    }

    return createResult(
        getMostSevere(results)?.status ?? COMPATIBILITY_FULL,
        reasons
    )
}

const OPERAND_REASON_BY_STATUS = {
    [COMPATIBILITY_NONE]: REASON_OPERAND_EMPTY,
    [COMPATIBILITY_PARTIAL]: REASON_OPERAND_PARTIAL,
}

/**
 * An expression's result, from its operands', by its missing value
 * strategy. SKIP_IF_ANY_VALUE_MISSING (the default): the most severe
 * decides. SKIP_IF_ALL_VALUES_MISSING or NEVER_SKIP: a missing value counts
 * as 0, so the operands add up (combineAddedUpResults). With more than one
 * operand, OPERAND_EMPTY and OPERAND_PARTIAL say first that one gives none
 * or only some values.
 */
export const combineOperandResults = (
    results,
    missingValueStrategy = SKIP_IF_ANY_VALUE_MISSING
) => {
    const needsAll = missingValueStrategy === SKIP_IF_ANY_VALUE_MISSING
    const combined = needsAll
        ? combineResults(results)
        : combineAddedUpResults(results)

    if (results.length < 2) {
        return combined
    }

    const operandReasons = needsAll
        ? [OPERAND_REASON_BY_STATUS[combined.status]]
        : results.map(({ status }) => OPERAND_REASON_BY_STATUS[status])

    return createResult(
        combined.status,
        unionOfReasons([{ reasons: operandReasons.filter(Boolean) }, combined])
    )
}

/**
 * An item's result from its operands' results (`resultOf(key)`), combined
 * as its expression says (profile.expression); without one, all are needed.
 * A part with no operand (constants only) never misses: it is left out.
 */
export const combineExpressionResults = (expression, operandKeys, resultOf) => {
    const combine = ({ operand, missingValueStrategy, parts }) => {
        if (operand) {
            return resultOf(operand)
        }

        const results = parts.map(combine).filter(Boolean)

        return results.length
            ? combineOperandResults(results, missingValueStrategy)
            : null
    }

    return (
        combine(
            expression ?? {
                missingValueStrategy: SKIP_IF_ANY_VALUE_MISSING,
                parts: operandKeys.map((key) => ({ operand: key })),
            }
        ) ?? createResult(COMPATIBILITY_FULL)
    )
}
