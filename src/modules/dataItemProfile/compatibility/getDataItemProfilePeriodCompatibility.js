import {
    REASON_PROFILE_UNKNOWN,
    REASON_SETTING_MISSING,
    REASON_UNKNOWN_PERIOD,
    REASON_UNSUPPORTED_VERSION,
} from '../constants.js'
import { getYearsTouched } from '../periods/firstLastValues.js'
import {
    getPeriodDates,
    isAlignedWithPeriodType,
} from '../periods/periodRanges.js'
import {
    canAggregateInto,
    getCandidatePeriodTypes,
    getPeriodTypeOfPeriodId,
    isPeriodType,
    isPeriodTypeSupported,
} from '../periods/periodTypes.js'
import { getRelativePeriodFixedPeriods } from '../periods/relativePeriodRanges.js'
import { getSourcePeriodType } from '../profile/assignedPeriodTypes.js'
import { getItemOperands, getSourceId } from '../sources.js'
import {
    combineAddedUpResults,
    combineExpressionResults,
    getUnknownResult,
} from './combineResults.js'
import { getOperandResult, getSourceResult } from './periodSourceResults.js'

// The operands' results, combined as the item's expression says
const getItemResult = ({ expression, operands }, query) => {
    const results = new Map(
        operands.map((operand) => [
            operand.key,
            getOperandResult(operand, query),
        ])
    )

    return combineExpressionResults(expression, [...results.keys()], (key) =>
        results.get(key)
    )
}

const isSameResult = (a, b) =>
    a.status === b.status && a.reasons.join() === b.reasons.join()

/* A relative period can be of several types: a result holds only when they
 * all agree. A type the server version can't answer gives unknown. */
const agreeOn = (queries, getResult) => {
    const results = queries.map((query) =>
        query.supported
            ? getResult(query)
            : getUnknownResult(REASON_UNSUPPORTED_VERSION)
    )

    return results.every((candidate) => isSameResult(candidate, results[0]))
        ? results[0]
        : getUnknownResult(REASON_SETTING_MISSING)
}

// Whether the period starts and ends on the edges of the data's own periods
const getAlignsWithData = (profile, { periodType, dates, calendar }) => {
    const dataPeriodTypes = profile.sources
        .map(getSourcePeriodType)
        .filter((dataPeriodType) =>
            canAggregateInto(dataPeriodType, periodType)
        )

    if (!dates || !dataPeriodTypes.length) {
        return null
    }

    const aligned = new Set(
        dataPeriodTypes.map((dataPeriodType) =>
            isAlignedWithPeriodType(dates, dataPeriodType, calendar)
        )
    )

    if (aligned.has(false)) {
        return false
    }

    return aligned.has(null) ? null : true
}

/* The date ranges a period covers for one of its types: a fixed period's,
 * the fixed periods of a relative one, none for a period type */
const getPeriodRanges = (period, periodType, options) => {
    if (getPeriodTypeOfPeriodId(period)) {
        const dates = getPeriodDates(period, options.calendar)

        return dates ? [dates] : null
    }

    return isPeriodType(period)
        ? null
        : getRelativePeriodFixedPeriods(period, periodType, options)
}

/* The calendar years the selection's periods touch, as one request would, or
 * null when a fixed or relative period can't be dated. Period types aren't
 * periods of a request: they don't count. */
export const getSelectionYears = (periods, options) => {
    const ranges = periods
        .filter((period) => !isPeriodType(period))
        .flatMap((period) =>
            getCandidatePeriodTypes(period, options).map((periodType) =>
                getPeriodRanges(period, periodType, options)
            )
        )

    if (!ranges.length || ranges.includes(null)) {
        return null
    }

    return [...new Set(ranges.flat().flatMap(getYearsTouched))].sort(
        (a, b) => a - b
    )
}

/* A result for each range of the query, added up: a relative period is
 * judged over its fixed periods. Without ranges, by type alone. */
const judgeRanges = (query, getResult) =>
    query.ranges
        ? combineAddedUpResults(
              query.ranges.map((dates) => getResult({ ...query, dates }))
          )
        : getResult({ ...query, dates: null })

const getUnknownPeriodResult = (profile, { period, periodTypes, reason }) => ({
    id: period,
    periodTypes,
    ...getUnknownResult(reason),
    alignsWithData: null,
    sources: profile.sources.map((source) => ({
        sourceId: getSourceId(source),
        ...getUnknownResult(reason),
    })),
})

/**
 * The queries a period is judged by, one per type it can be (`options`
 * holding the `selectionYears`), or the reason it can't be: `{ periodTypes,
 * queries }` or `{ periodTypes, unknownReason }`. judgePeriodQueries judges
 * them.
 */
export const getPeriodQueries = (profile, period, options) => {
    const periodTypes = getCandidatePeriodTypes(period, options)

    if (profile.unknown || !periodTypes.length) {
        return {
            periodTypes,
            unknownReason: profile.unknown
                ? REASON_PROFILE_UNKNOWN
                : REASON_UNKNOWN_PERIOD,
        }
    }

    return {
        periodTypes,
        queries: periodTypes.map((periodType) => ({
            periodType,
            ranges: getPeriodRanges(period, periodType, options),
            years: options.selectionYears,
            calendar: options.calendar,
            serverVersion: options.serverVersion,
            supported: isPeriodTypeSupported(periodType, options.serverVersion),
        })),
    }
}

// A result from `getResult(query)` for each type and range, as one result for the period
export const judgePeriodQueries = (queries, getResult) =>
    agreeOn(queries, (query) => judgeRanges(query, getResult))

const getPeriodResult = (profile, period, options) => {
    const { periodTypes, queries, unknownReason } = getPeriodQueries(
        profile,
        period,
        options
    )

    if (unknownReason) {
        return getUnknownPeriodResult(profile, {
            period,
            periodTypes,
            reason: unknownReason,
        })
    }

    const item = {
        expression: profile.expression,
        operands: getItemOperands(profile),
    }
    const isFixed = Boolean(getPeriodTypeOfPeriodId(period))

    return {
        id: period,
        periodTypes,
        ...judgePeriodQueries(queries, (query) => getItemResult(item, query)),
        alignsWithData: isFixed
            ? getAlignsWithData(profile, {
                  ...queries[0],
                  dates: queries[0].ranges?.[0],
              })
            : null,
        sources: profile.sources.map((source) => ({
            sourceId: getSourceId(source),
            ...judgePeriodQueries(queries, (query) =>
                getSourceResult(source, query)
            ),
        })),
    }
}

/**
 * Whether the periods of a selection suit a data item, from its profile: for
 * each period, `{ id, periodTypes, status, reasons, alignsWithData, sources }`,
 * with a result per source (aligned with `profile.sources`).
 *
 * `periods` are fixed ids, relative ids or period types. A relative period is
 * judged over the fixed periods it covers on `options.relativePeriodDate`
 * (an ISO date, today by default). `options` also sets the type of relative
 * weeks and financial years (`weeklyPeriodType`, `financialYearPeriodType`),
 * the `calendar` for dates, and the `serverVersion` ({ major, minor }), since
 * some versions can't answer some period types. The periods are taken as one
 * request: for FIRST and LAST data, the years they touch decide which data
 * periods count (other items of the request, like a `.periodOffset()`
 * operand, can add years and aren't seen). A period type is judged by type
 * alone.
 */
export const getDataItemProfilePeriodCompatibility = (
    profile,
    { periods = [] } = {},
    options = {}
) => {
    const selectionYears = getSelectionYears(periods, options)

    return periods.map((period) =>
        getPeriodResult(profile, period, { ...options, selectionYears })
    )
}
