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
    isPeriodTypeSupported,
} from '../periods/periodTypes.js'
import { getSourcePeriodType } from '../profile/assignedPeriodTypes.js'
import { getItemOperands, getSourceId } from '../sources.js'
import { combineOperandResults, getUnknownResult } from './combineResults.js'
import { getOperandResult, getSourceResult } from './periodSourceResults.js'

// An expression needs all its operands: the most severe one decides
const getItemResult = (operands, query) =>
    combineOperandResults(
        operands.map((operand) => getOperandResult(operand, query))
    )

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
    ...getUnknownResult(reason),
    alignsWithData: null,
    sources: profile.sources.map((source) => ({
        sourceId: getSourceId(source),
        ...getUnknownResult(reason),
    })),
})

const getPeriodResult = (profile, period, options) => {
    const periodTypes = getCandidatePeriodTypes(period, options)

    if (profile.unknown || !periodTypes.length) {
        return getUnknownPeriodResult(profile, {
            period,
            periodTypes,
            reason: profile.unknown
                ? REASON_PROFILE_UNKNOWN
                : REASON_UNKNOWN_PERIOD,
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
        serverVersion: options.serverVersion,
        supported: isPeriodTypeSupported(periodType, options.serverVersion),
    }))
    const operands = getItemOperands(profile)

    return {
        id: period,
        periodTypes,
        ...agreeOn(queries, (query) => getItemResult(operands, query)),
        alignsWithData:
            queries.length === 1
                ? getAlignsWithData(profile, queries[0])
                : null,
        sources: profile.sources.map((source) => ({
            sourceId: getSourceId(source),
            ...agreeOn(queries, (query) => getSourceResult(source, query)),
        })),
    }
}

/**
 * Whether the periods of a selection suit a data item, from its profile: for
 * each period, `{ id, periodTypes, status, reasons, alignsWithData, sources }`,
 * with a result per source (aligned with `profile.sources`).
 *
 * `periods` are fixed ids, relative ids or period types. `options` sets the
 * type of relative weeks and financial years (`weeklyPeriodType`,
 * `financialYearPeriodType`), the `calendar` for dates, and the
 * `serverVersion` ({ major, minor }), since some versions can't answer some
 * period types. The periods are taken as one request: for FIRST and LAST
 * data, the years they touch decide which data periods count (other items of
 * the request, like a `.periodOffset()` operand, can add years and aren't
 * seen).
 */
export const getDataItemProfilePeriodCompatibility = (
    profile,
    { periods = [], ...options } = {}
) => {
    const selectionYears = getSelectionYears(periods, options.calendar)

    return periods.map((period) =>
        getPeriodResult(profile, period, { ...options, selectionYears })
    )
}
