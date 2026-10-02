export const COMPATIBILITY_FULL = 'full'
export const COMPATIBILITY_PARTIAL = 'partial'
export const COMPATIBILITY_NONE = 'none'
export const COMPATIBILITY_UNKNOWN = 'unknown'

// The profile is unknown: see its reasons
export const REASON_PROFILE_UNKNOWN = 'PROFILE_UNKNOWN'

/* An expression whose operand gives no value has none (a ratio without its
 * denominator); one whose operand leaves values out is computed from
 * incomplete data, and can be off either way */
export const REASON_OPERAND_EMPTY = 'OPERAND_EMPTY'
export const REASON_OPERAND_PARTIAL = 'OPERAND_PARTIAL'

export const OPERAND_REASONS = [REASON_OPERAND_EMPTY, REASON_OPERAND_PARTIAL]

/**
 * An expression's result, from its most severe operand's: with more than one
 * operand, a none or partial result says so with OPERAND_EMPTY or
 * OPERAND_PARTIAL, first.
 */
export const withOperandReason = (result, operandCount) => {
    const reason =
        operandCount > 1 &&
        {
            [COMPATIBILITY_NONE]: REASON_OPERAND_EMPTY,
            [COMPATIBILITY_PARTIAL]: REASON_OPERAND_PARTIAL,
        }[result.status]

    return reason ? { ...result, reasons: [reason, ...result.reasons] } : result
}
