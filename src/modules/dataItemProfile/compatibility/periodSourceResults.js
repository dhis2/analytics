import {
    COMPATIBILITY_FULL,
    COMPATIBILITY_NONE,
    PERIOD_AGGREGATION_AVERAGE,
    PERIOD_AGGREGATION_FIRST,
    PERIOD_AGGREGATION_LAST,
    REASON_EARLIER_PERIOD_VALUE,
    REASON_NO_EARLIER_PERIOD_VALUE,
    REASON_PERIOD_TOO_SHORT,
    REASON_PERIOD_TYPE_MISMATCH,
    REASON_REPEATED_VALUE,
    REASON_REPORTING_RATE_TOO_SHORT,
    REASON_UNSUPPORTED_VERSION,
} from '../constants.js'
import { getFirstOrLastValuePeriod } from '../periods/firstLastValues.js'
import { getFixedPeriodOfTypeByDate } from '../periods/periodRanges.js'
import { canAggregateInto, getFrequencyOrder } from '../periods/periodTypes.js'
import { getSourcePeriodType } from '../profile/assignedPeriodTypes.js'
import { isProgramSource } from '../sources.js'
import {
    combineAddedUpResults,
    combineResults,
    createResult,
    getUnknownResult,
} from './combineResults.js'

/* The period rules for one source and one query ({ periodType, dates, years,
 * calendar, serverVersion }): a fixed period's dates, the years the request
 * touches, and a period type of the selection */

const FULL = createResult(COMPATIBILITY_FULL)

const getMissingReason = (dataPeriodType, queryPeriodType) =>
    getFrequencyOrder(queryPeriodType) < getFrequencyOrder(dataPeriodType)
        ? REASON_PERIOD_TOO_SHORT
        : REASON_PERIOD_TYPE_MISMATCH

/* FIRST and LAST data, by analytics' rule (firstLastValues.js): the value of
 * a data period inside the period, of one before it, or none. It can only be
 * told for fixed periods in a selection of fixed periods, since every period
 * of the request decides which data periods count. */
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
        const takesEarlierValue =
            element.periodAggregationType === PERIOD_AGGREGATION_FIRST ||
            !canAggregateInto(dataPeriodType, query.periodType)

        return takesEarlierValue
            ? createResult(COMPATIBILITY_FULL, [REASON_EARLIER_PERIOD_VALUE])
            : FULL
    }

    const valuePeriod = getFirstOrLastValuePeriod({
        periodAggregationType: element.periodAggregationType,
        periodType: dataPeriodType,
        dates: query.dates,
        years: query.years,
        calendar: query.calendar,
    })

    if (!valuePeriod) {
        return createResult(COMPATIBILITY_NONE, [
            REASON_NO_EARLIER_PERIOD_VALUE,
        ])
    }

    return valuePeriod.startDate >= query.dates.startDate
        ? FULL
        : createResult(COMPATIBILITY_FULL, [REASON_EARLIER_PERIOD_VALUE])
}

/* One element of one data set, for one query. When the data can't add up
 * into the period, averaged values are repeated into it, and other data
 * gives none. FIRST and LAST follow their own rule. */
const getElementResult = (element, dataPeriodType, query) => {
    if (
        element.periodAggregationType === PERIOD_AGGREGATION_FIRST ||
        element.periodAggregationType === PERIOD_AGGREGATION_LAST
    ) {
        return getFirstOrLastResult(element, dataPeriodType, query)
    }

    if (canAggregateInto(dataPeriodType, query.periodType)) {
        return FULL
    }

    return element.periodAggregationType === PERIOD_AGGREGATION_AVERAGE
        ? createResult(COMPATIBILITY_FULL, [REASON_REPEATED_VALUE])
        : createResult(COMPATIBILITY_NONE, [
              getMissingReason(dataPeriodType, query.periodType),
          ])
}

// A reporting rate asked for a shorter period gives a meaningless value
const getReportingRateResult = (dataPeriodType, query) =>
    canAggregateInto(dataPeriodType, query.periodType)
        ? FULL
        : createResult(COMPATIBILITY_NONE, [REASON_REPORTING_RATE_TOO_SHORT])

/* Events and enrollments are placed by their own dates: they fit any period.
 * VERSION-TOGGLE: remove the check when 43 is the lowest supported version.
 * Before 2.43, analytics can't query a program indicator without period
 * boundaries (E7145). */
const getProgramResult = (source, query) => {
    const missingBoundariesUnsupported =
        source.missingPeriodBoundaries &&
        query.serverVersion?.major === 2 &&
        query.serverVersion.minor < 43

    return missingBoundariesUnsupported
        ? getUnknownResult(REASON_UNSUPPORTED_VERSION)
        : FULL
}

export const getSourceResult = (source, query) => {
    if (isProgramSource(source)) {
        return getProgramResult(source, query)
    }

    const dataPeriodType = getSourcePeriodType(source)
    const results = source.elements.map((element) =>
        getElementResult(element, dataPeriodType, query)
    )

    if (source.reportingRate) {
        results.push(getReportingRateResult(dataPeriodType, query))
    }

    return combineResults(results)
}

// Each source of one operand (getItemOperands) for one query, aligned with its `sources`
export const getOperandSourceResults = (
    { element, reportingRate, sources },
    query
) =>
    sources.map((source) => {
        if (element) {
            return getElementResult(element, getSourcePeriodType(source), query)
        }

        return reportingRate
            ? getReportingRateResult(getSourcePeriodType(source), query)
            : getProgramResult(source, query)
    })

// One operand for one query: an element adds up over its data sets
export const getOperandResult = (operand, query) =>
    combineAddedUpResults(getOperandSourceResults(operand, query))
