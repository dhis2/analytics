import { PERIOD_TYPES } from '../constants.js'
import {
    canAggregateInto,
    isPeriodType,
    sortPeriodTypes,
} from '../periods/periodTypes.js'

// The source's period type, or null for a program, an element in no data set, or an unknown type
export const getSourcePeriodType = ({ dataSet }) =>
    isPeriodType(dataSet?.periodType) ? dataSet.periodType : null

/* The shortest query type that every type adds up into: the longest of them
 * when they nest, the next type up when two have the same length (Monday and
 * Wednesday weeks: BiWeekly) */
const getShortestDirectType = (periodTypes) =>
    sortPeriodTypes(PERIOD_TYPES).find((queryPeriodType) =>
        periodTypes.every((periodType) =>
            canAggregateInto(periodType, queryPeriodType)
        )
    ) ?? null

/**
 * The period types of the data sets an item is assigned to, shortest first;
 * `shortestDirectType`, the shortest type at which every value adds up
 * directly (shorter ones get repeated or earlier values, or none, see
 * getDataItemProfilePeriodCompatibility), or null when nothing is assigned by
 * period (event data); and whether there are several types (`hasSeveral`).
 */
export const getAssignedPeriodTypes = (sources) => {
    const types = sortPeriodTypes([
        ...new Set(sources.map(getSourcePeriodType).filter(Boolean)),
    ])

    return {
        types,
        shortestDirectType: types.length ? getShortestDirectType(types) : null,
        hasSeveral: types.length > 1,
    }
}
