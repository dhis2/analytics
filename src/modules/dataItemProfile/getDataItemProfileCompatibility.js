import { getCarriedSource, getYearsTouched } from './carriedValues.js'
import {
    COMPATIBILITY_FULL,
    COMPATIBILITY_NONE,
    COMPATIBILITY_PARTIAL,
    COMPATIBILITY_UNKNOWN,
    OPERAND_REASONS,
    REASON_PROFILE_UNKNOWN,
    withOperandReason,
} from './compatibilityStatuses.js'
import {
    getDataItemOrgUnitCompatibility,
    ORG_UNIT_REASON_ORDER,
} from './getDataItemOrgUnitCompatibility.js'
import {
    PERIOD_AGGREGATION_AVERAGE,
    PERIOD_AGGREGATION_FIRST,
    PERIOD_AGGREGATION_LAST,
    getSourcePeriodType,
} from './getDataItemProfile.js'
import {
    aggregatesInto,
    getFixedPeriodOfTypeByDate,
    getPeriodDates,
    periodNestsIn,
} from './periodTypeRelations.js'
import {
    getCandidatePeriodTypes,
    getFrequencyOrder,
    getPeriodTypeOfPeriodId,
    isPeriodTypeSupported,
} from './periodTypes.js'

export {
    COMPATIBILITY_FULL,
    COMPATIBILITY_NONE,
    COMPATIBILITY_PARTIAL,
    COMPATIBILITY_UNKNOWN,
    REASON_OPERAND_EMPTY,
    REASON_OPERAND_PARTIAL,
    REASON_PROFILE_UNKNOWN,
} from './compatibilityStatuses.js'

// A value, but not measured for the period
export const REASON_AVERAGED = 'AVERAGED'
export const REASON_CARRIED = 'CARRIED'
// No real value from some or all of the data
export const REASON_SHORTER = 'SHORTER'
export const REASON_OTHER_TYPE = 'OTHER_TYPE'
export const REASON_REPORTING_RATE = 'REPORTING_RATE'
export const REASON_NOTHING_TO_CARRY = 'NOTHING_TO_CARRY'
// Can't tell
export const REASON_UNKNOWN_PERIOD = 'UNKNOWN_PERIOD'
export const REASON_SETTING_MISSING = 'SETTING_MISSING'
export const REASON_UNSUPPORTED_VERSION = 'UNSUPPORTED_VERSION'

const REASON_ORDER = [
    ...OPERAND_REASONS,
    REASON_SHORTER,
    REASON_OTHER_TYPE,
    REASON_REPORTING_RATE,
    REASON_NOTHING_TO_CARRY,
    REASON_AVERAGED,
    REASON_CARRIED,
    REASON_PROFILE_UNKNOWN,
    REASON_UNKNOWN_PERIOD,
    REASON_SETTING_MISSING,
    REASON_UNSUPPORTED_VERSION,
    ...ORG_UNIT_REASON_ORDER.filter(
        (reason) => !OPERAND_REASONS.includes(reason)
    ),
]

// Most severe first
const SEVERITY = [
    COMPATIBILITY_NONE,
    COMPATIBILITY_PARTIAL,
    COMPATIBILITY_UNKNOWN,
    COMPATIBILITY_FULL,
]

const result = (status, reasons = []) => ({ status, reasons })

const getMostSevere = (statuses) =>
    SEVERITY.find((status) => statuses.includes(status)) ?? null

const unionOfReasons = (results) =>
    REASON_ORDER.filter((reason) =>
        results.some(({ reasons }) => reasons.includes(reason))
    )

// The most severe status, with every reason
const combine = (results) =>
    result(
        getMostSevere(results.map(({ status }) => status)) ??
            COMPATIBILITY_FULL,
        unionOfReasons(results)
    )

const getMissingReason = (dataPeriodType, queryPeriodType) =>
    getFrequencyOrder(queryPeriodType) < getFrequencyOrder(dataPeriodType)
        ? REASON_SHORTER
        : REASON_OTHER_TYPE

/* FIRST and LAST data, by analytics' carry rule (carriedValues.js): the
 * value of a data period inside the period, of one before it, or none. It can
 * only be told for fixed periods in a selection of fixed periods, since every
 * period of the request decides which data periods count. */
const getFirstOrLastResult = (element, dataPeriodType, query) => {
    const canDate =
        query.dates &&
        query.years &&
        getFixedPeriodOfTypeByDate(
            dataPeriodType,
            query.dates.endDate,
            query.calendar
        )

    if (!canDate) {
        const carries =
            element.periodAggregationType === PERIOD_AGGREGATION_FIRST ||
            !aggregatesInto(dataPeriodType, query.periodType)

        return carries
            ? result(COMPATIBILITY_FULL, [REASON_CARRIED])
            : result(COMPATIBILITY_FULL)
    }

    const source = getCarriedSource({
        periodAggregationType: element.periodAggregationType,
        periodType: dataPeriodType,
        dates: query.dates,
        years: query.years,
        calendar: query.calendar,
    })

    if (!source) {
        return result(COMPATIBILITY_NONE, [REASON_NOTHING_TO_CARRY])
    }

    return source.startDate >= query.dates.startDate
        ? result(COMPATIBILITY_FULL)
        : result(COMPATIBILITY_FULL, [REASON_CARRIED])
}

/* One element of one data set, asked for one query. When the data can't add
 * up into the period, averaged values are repeated into it, and other data
 * gives none. FIRST and LAST follow their own rule. */
const getElementResult = (element, dataPeriodType, query) => {
    if (
        element.periodAggregationType === PERIOD_AGGREGATION_FIRST ||
        element.periodAggregationType === PERIOD_AGGREGATION_LAST
    ) {
        return getFirstOrLastResult(element, dataPeriodType, query)
    }

    if (aggregatesInto(dataPeriodType, query.periodType)) {
        return result(COMPATIBILITY_FULL)
    }

    return element.periodAggregationType === PERIOD_AGGREGATION_AVERAGE
        ? result(COMPATIBILITY_FULL, [REASON_AVERAGED])
        : result(COMPATIBILITY_NONE, [
              getMissingReason(dataPeriodType, query.periodType),
          ])
}

// A reporting rate asked for a shorter period gives a meaningless value
const getReportingRateResult = (dataPeriodType, queryPeriodType) =>
    aggregatesInto(dataPeriodType, queryPeriodType)
        ? result(COMPATIBILITY_FULL)
        : result(COMPATIBILITY_NONE, [REASON_REPORTING_RATE])

const getSourceResult = (source, query) => {
    const dataPeriodType = getSourcePeriodType(source)
    const results = source.elements.map((element) =>
        getElementResult(element, dataPeriodType, query)
    )

    if (source.reportingRate) {
        results.push(getReportingRateResult(dataPeriodType, query.periodType))
    }

    return combine(results)
}

/* The values of one element over its data sets add up: some missing is
 * partial */
const combineDataSets = (results) => {
    const statuses = results.map(({ status }) => status)
    const reasons = unionOfReasons(results)

    if (statuses.every((status) => status === COMPATIBILITY_NONE)) {
        return result(COMPATIBILITY_NONE, reasons)
    }

    return statuses.includes(COMPATIBILITY_NONE)
        ? result(COMPATIBILITY_PARTIAL, reasons)
        : result(COMPATIBILITY_FULL, reasons)
}

/* The item's operands: each element over its data sets, and each reporting
 * rate. An expression needs them all: the most severe one decides. */
const getItemResult = (profile, query) => {
    const elements = new Map()
    const operands = []

    profile.sources.forEach((source) => {
        const dataPeriodType = getSourcePeriodType(source)

        source.elements.forEach((element) => {
            const key = `${element.id}:${element.aggregationType}`
            const results = elements.get(key) ?? []

            results.push(getElementResult(element, dataPeriodType, query))
            elements.set(key, results)
        })

        if (source.reportingRate) {
            operands.push(
                getReportingRateResult(dataPeriodType, query.periodType)
            )
        }
    })

    elements.forEach((results) => operands.push(combineDataSets(results)))

    return withOperandReason(combine(operands), operands.length)
}

const isSameResult = (a, b) =>
    a.status === b.status && a.reasons.join() === b.reasons.join()

/* A relative period can be of several types: a result holds only when they
 * all agree. A type the server version can't answer gives unknown. */
const agreeOn = (queries, getResult) => {
    const results = queries.map((query) =>
        query.supported
            ? getResult(query)
            : result(COMPATIBILITY_UNKNOWN, [REASON_UNSUPPORTED_VERSION])
    )

    return results.every((candidate) => isSameResult(candidate, results[0]))
        ? results[0]
        : result(COMPATIBILITY_UNKNOWN, [REASON_SETTING_MISSING])
}

// Whether the period starts and ends on the edges of the data's own periods
const getAlignsWithData = (profile, { periodType, dates, calendar }) => {
    const dataPeriodTypes = profile.sources
        .map(getSourcePeriodType)
        .filter((dataPeriodType) => aggregatesInto(dataPeriodType, periodType))

    if (!dates || !dataPeriodTypes.length) {
        return null
    }

    const aligned = dataPeriodTypes.map((dataPeriodType) =>
        periodNestsIn(dates, dataPeriodType, calendar)
    )

    if (aligned.includes(false)) {
        return false
    }

    return aligned.includes(null) ? null : true
}

const getDataSetId = ({ dataSet }) => dataSet?.id ?? null

/* The calendar years the selection's periods touch, as one request would, or
 * null when a period has no dates (a relative period, a period type) */
const getSelectionYears = (periods, calendar) => {
    const dates = periods.map((period) =>
        getPeriodTypeOfPeriodId(period)
            ? getPeriodDates(period, calendar)
            : null
    )

    if (!dates.length || dates.includes(null)) {
        return null
    }

    return [...new Set(dates.flatMap(getYearsTouched))].sort((a, b) => a - b)
}

const getUnknownPeriodResult = (profile, { period, periodTypes, reason }) => ({
    id: period,
    periodTypes,
    ...result(COMPATIBILITY_UNKNOWN, [reason]),
    alignsWithData: null,
    sources: profile.sources.map((source) => ({
        dataSetId: getDataSetId(source),
        ...result(COMPATIBILITY_UNKNOWN, [reason]),
    })),
})

const getPeriodResult = (profile, period, options) => {
    const periodTypes = getCandidatePeriodTypes(period, options)

    if (profile.unknown) {
        return getUnknownPeriodResult(profile, {
            period,
            periodTypes,
            reason: REASON_PROFILE_UNKNOWN,
        })
    }

    if (!periodTypes.length) {
        return getUnknownPeriodResult(profile, {
            period,
            periodTypes,
            reason: REASON_UNKNOWN_PERIOD,
        })
    }

    const dates = getPeriodTypeOfPeriodId(period)
        ? getPeriodDates(period, options.calendar)
        : null
    const queries = periodTypes.map((periodType) => ({
        periodType,
        dates,
        years: options.selectionYears,
        calendar: options.calendar,
        supported: isPeriodTypeSupported(periodType, options.serverVersion),
    }))

    return {
        id: period,
        periodTypes,
        ...agreeOn(queries, (query) => getItemResult(profile, query)),
        alignsWithData:
            queries.length === 1
                ? getAlignsWithData(profile, queries[0])
                : null,
        sources: profile.sources.map((source) => ({
            dataSetId: getDataSetId(source),
            ...agreeOn(queries, (query) => getSourceResult(source, query)),
        })),
    }
}

/**
 * Whether a selection suits a data item, from its getDataItemProfile: for
 * each period, whether analytics will return the item's values.
 *
 * The compatibility status is `full`, `partial`, `none` or `unknown`:
 * compatible with all, some or none of the item's data sets. `reasons` say
 * why, and on a full result whether values are averaged or carried
 * rather than measured for the period. Results are given per period, per
 * source (aligned with `profile.sources`) and overall (the most severe, with
 * every reason).
 *
 * `selection.periods` are fixed ids, relative ids or period types. `options`
 * sets the type of relative weeks and financial years (`weeklyPeriodType`,
 * `financialYearPeriodType`), the `calendar` for dates, and the
 * `serverVersion` ({ major, minor }), since some versions can't answer some
 * period types. The periods are taken as one request: for FIRST and LAST data,
 * the years they touch decide which data periods count (other items of the
 * request, like a `.periodOffset()` operand, can add years and aren't seen).
 *
 * `selection.orgUnits` are DV's org unit items (unit ids, LEVEL-n, the
 * user's units), judged from `options.orgUnitCoverage` (fetchOrgUnitCoverage)
 * by getDataItemOrgUnitCompatibility: one result each, in `orgUnits`. Periods
 * and places are judged apart: a data set assigned to some places only, at
 * another period type than the others, isn't judged by place yet.
 */
export const getDataItemProfileCompatibility = (
    profile,
    { periods = [], orgUnits = [] } = {},
    options = {}
) => {
    const selectionYears = getSelectionYears(periods, options.calendar)
    const results = periods.map((period) =>
        getPeriodResult(profile, period, { ...options, selectionYears })
    )
    const orgUnitResults = orgUnits.length
        ? getDataItemOrgUnitCompatibility(
              profile,
              orgUnits,
              options.orgUnitCoverage
          )
        : []
    const all = [...results, ...orgUnitResults]
    const overall = all.length ? combine(all) : { status: null, reasons: [] }

    return {
        ...overall,
        sources: profile.sources.map((source, i) => ({
            dataSetId: getDataSetId(source),
            ...(results.length
                ? combine(results.map(({ sources }) => sources[i]))
                : { status: null, reasons: [] }),
        })),
        periods: results,
        ...(orgUnits.length && { orgUnits: orgUnitResults }),
    }
}
