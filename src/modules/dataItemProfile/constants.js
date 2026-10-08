// Compatibility statuses: compatible with all, some or none of the item's sources that apply to the selection
export const COMPATIBILITY_FULL = 'full'
export const COMPATIBILITY_PARTIAL = 'partial'
export const COMPATIBILITY_NONE = 'none'
export const COMPATIBILITY_UNKNOWN = 'unknown'

// Most severe first: where all results are needed (an indicator's two sides), the most severe wins
export const COMPATIBILITY_SEVERITY = [
    COMPATIBILITY_NONE,
    COMPATIBILITY_PARTIAL,
    COMPATIBILITY_UNKNOWN,
    COMPATIBILITY_FULL,
]

/* Why a profile is unknown (profile.reasons, each with the id it concerns):
 * metadata is missing or can't be read, never guessed */
export const PROFILE_REASON_MISSING_METADATA = 'MISSING_METADATA'
export const PROFILE_REASON_MISSING_PROGRAM = 'MISSING_PROGRAM'
export const PROFILE_REASON_UNKNOWN_OPERAND = 'UNKNOWN_OPERAND'
export const PROFILE_REASON_UNKNOWN_PERIOD_TYPE = 'UNKNOWN_PERIOD_TYPE'
export const PROFILE_REASON_UNSUPPORTED_ITEM_TYPE = 'UNSUPPORTED_ITEM_TYPE'
export const PROFILE_REASON_NO_DATA_SET = 'NO_DATA_SET'
export const PROFILE_REASON_NOT_AGGREGATABLE = 'NOT_AGGREGATABLE'

/* Why a compatibility status, in the order results list them */

// An operand gives no value: a sum misses it, a side where all are missing has none (a ratio without its denominator)
export const REASON_OPERAND_EMPTY = 'OPERAND_EMPTY'
// An expression computed from an operand that leaves values out: it can be off either way
export const REASON_OPERAND_PARTIAL = 'OPERAND_PARTIAL'

// The period is shorter than the period type of the data sets
export const REASON_PERIOD_TOO_SHORT = 'PERIOD_TOO_SHORT'
// Another period type of the same length (Wednesday weeks asked by Monday week)
export const REASON_PERIOD_TYPE_MISMATCH = 'PERIOD_TYPE_MISMATCH'
// A reporting rate asked for a shorter period: a meaningless value
export const REASON_REPORTING_RATE_TOO_SHORT = 'REPORTING_RATE_TOO_SHORT'
// FIRST or LAST data with no data period that counts for the period
export const REASON_NO_EARLIER_PERIOD_VALUE = 'NO_EARLIER_PERIOD_VALUE'
// The value of a longer data period, repeated (period aggregation AVERAGE)
export const REASON_REPEATED_VALUE = 'REPEATED_VALUE'
// The value of an earlier data period (period aggregation FIRST or LAST)
export const REASON_EARLIER_PERIOD_VALUE = 'EARLIER_PERIOD_VALUE'

// Neither the org unit nor its ancestors are assigned: nothing is there to show
export const REASON_NOT_ASSIGNED = 'NOT_ASSIGNED'
// Assigned only at higher levels than the one asked: analytics never splits values down
export const REASON_ASSIGNED_AT_HIGHER_LEVEL = 'ASSIGNED_AT_HIGHER_LEVEL'
// The data element's aggregation levels stop values from reaching the level asked
export const REASON_STOPPED_BY_AGGREGATION_LEVEL =
    'STOPPED_BY_AGGREGATION_LEVEL'
// No org unit at the level asked under the parent org units, or no group member under them
export const REASON_NO_ORG_UNITS_AT_LEVEL = 'NO_ORG_UNITS_AT_LEVEL'
// An org unit group without members: analytics refuses it (E7143), leave it out of the request
export const REASON_EMPTY_GROUP = 'EMPTY_GROUP'
// Assigned to only some org units at the deepest level: the others aren't assigned, so nothing is left out
export const REASON_PARTLY_ASSIGNED = 'PARTLY_ASSIGNED'
// A program indicator placed by registration or an org unit attribute: values can be at any org unit
export const REASON_ANY_ORG_UNIT = 'ANY_ORG_UNIT'

// The profile is unknown: see its reasons
export const REASON_PROFILE_UNKNOWN = 'PROFILE_UNKNOWN'
// The period id can't be read
export const REASON_UNKNOWN_PERIOD = 'UNKNOWN_PERIOD'
// A relative period's type depends on a setting that wasn't given, and its types disagree
export const REASON_SETTING_MISSING = 'SETTING_MISSING'
// The server version can't answer it (QuarterlyNov before 2.41, a program indicator without period boundaries before 2.43)
export const REASON_UNSUPPORTED_VERSION = 'UNSUPPORTED_VERSION'
// The org unit, level or group isn't loaded or can't be read
export const REASON_UNKNOWN_ORG_UNIT = 'UNKNOWN_ORG_UNIT'

export const REASON_ORDER = [
    REASON_OPERAND_EMPTY,
    REASON_OPERAND_PARTIAL,
    REASON_PERIOD_TOO_SHORT,
    REASON_PERIOD_TYPE_MISMATCH,
    REASON_REPORTING_RATE_TOO_SHORT,
    REASON_NO_EARLIER_PERIOD_VALUE,
    REASON_REPEATED_VALUE,
    REASON_EARLIER_PERIOD_VALUE,
    REASON_NOT_ASSIGNED,
    REASON_ASSIGNED_AT_HIGHER_LEVEL,
    REASON_STOPPED_BY_AGGREGATION_LEVEL,
    REASON_NO_ORG_UNITS_AT_LEVEL,
    REASON_EMPTY_GROUP,
    REASON_PARTLY_ASSIGNED,
    REASON_ANY_ORG_UNIT,
    REASON_PROFILE_UNKNOWN,
    REASON_UNKNOWN_PERIOD,
    REASON_SETTING_MISSING,
    REASON_UNSUPPORTED_VERSION,
    REASON_UNKNOWN_ORG_UNIT,
]

// Values that exist but can't reach the org unit level asked
export const LEFT_OUT_REASONS = new Set([
    REASON_ASSIGNED_AT_HIGHER_LEVEL,
    REASON_STOPPED_BY_AGGREGATION_LEVEL,
])

/* How an expression treats missing operand values (dhis2-core
 * MissingValueStrategy). Indicators evaluate each side with
 * SKIP_IF_ALL_VALUES_MISSING, then need both sides; expression dimension
 * items are evaluated with SKIP_IF_ALL_VALUES_MISSING, whatever strategy they
 * are saved with (checked by the test tool on 2.40 to 2.44). */
export const SKIP_IF_ANY_VALUE_MISSING = 'SKIP_IF_ANY_VALUE_MISSING'
export const SKIP_IF_ALL_VALUES_MISSING = 'SKIP_IF_ALL_VALUES_MISSING'

/* Expression operands without a dimension item type: constants, org unit
 * group counts and [days] have no source; an unknown prefix makes the
 * profile unknown */
export const OPERAND_TYPE_CONSTANT = 'CONSTANT'
export const OPERAND_TYPE_ORG_UNIT_GROUP = 'ORG_UNIT_GROUP'
export const OPERAND_TYPE_DAYS = 'DAYS'
export const OPERAND_TYPE_UNKNOWN = 'UNKNOWN'

// How values aggregate over time (dhis2-core periodAggregationType)
export const PERIOD_AGGREGATION_AVERAGE = 'AVERAGE'
export const PERIOD_AGGREGATION_FIRST = 'FIRST'
export const PERIOD_AGGREGATION_LAST = 'LAST'

export const NOT_AGGREGATABLE_AGGREGATION_TYPES = new Set(['NONE'])

/* A program indicator's orgUnitField that places values where its program is
 * assigned: the event's or enrollment's org unit (unset, EVENT, ENROLLMENT),
 * or the owner's, which falls back to it. REGISTRATION and an org unit data
 * element or attribute (its id) can place values at any org unit. */
export const PROGRAM_ORG_UNIT_FIELDS = new Set([
    'EVENT',
    'ENROLLMENT',
    'OWNER_AT_START',
    'OWNER_AT_END',
])

// Org unit selection items, as DV saves them
export const ORG_UNIT_ITEM_TYPE_ORG_UNIT = 'ORG_UNIT'
export const ORG_UNIT_ITEM_TYPE_LEVEL = 'LEVEL'
export const ORG_UNIT_ITEM_TYPE_GROUP = 'GROUP'
export const ORG_UNIT_ITEM_TYPE_USER = 'USER'
export const ORG_UNIT_ITEM_TYPE_UNKNOWN = 'UNKNOWN'

// Server period type names with their frequencyOrder, as /api/periodTypes returns them
export const PERIOD_TYPE_FREQUENCY_ORDER = {
    Daily: 1,
    Weekly: 7,
    WeeklyWednesday: 7,
    WeeklyThursday: 7,
    WeeklyFriday: 7,
    WeeklySaturday: 7,
    WeeklySunday: 7,
    BiWeekly: 14,
    Monthly: 30,
    BiMonthly: 61,
    Quarterly: 91,
    QuarterlyNov: 91,
    SixMonthly: 182,
    SixMonthlyApril: 182,
    SixMonthlyNov: 182,
    Yearly: 365,
    FinancialFeb: 365,
    FinancialApril: 365,
    FinancialJuly: 365,
    FinancialAug: 365,
    FinancialSep: 365,
    FinancialOct: 365,
    FinancialNov: 365,
    TwoYearly: 730,
}

export const PERIOD_TYPES = Object.keys(PERIOD_TYPE_FREQUENCY_ORDER)
