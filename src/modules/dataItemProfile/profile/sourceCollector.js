import {
    PROFILE_REASON_MISSING_METADATA,
    PROFILE_REASON_UNKNOWN_PERIOD_TYPE,
} from '../constants.js'
import { isPeriodType } from '../periods/periodTypes.js'
import { usesProgramOrgUnits } from '../sources.js'

/* Sources, by key: one per data set; one per program, and per way its
 * indicators place values; one per data element in no data set */

export const createCollector = () => ({
    sources: new Map(),
    reasons: [],
    visitedIndicators: new Set(),
})

export const addReason = (collector, reason) => collector.reasons.push(reason)

const getSource = (collector, key, createSource) => {
    if (!collector.sources.has(key)) {
        collector.sources.set(key, createSource())
    }

    return collector.sources.get(key)
}

export const getDataSetSource = (collector, { id, periodType }) =>
    getSource(collector, `dataSet:${id ?? periodType}`, () => ({
        dataSet: { id, periodType },
        elements: [],
        reportingRate: false,
    }))

export const getUnassignedElementSource = (collector, elementId) =>
    getSource(collector, `element:${elementId}`, () => ({
        dataSet: null,
        elements: [],
        reportingRate: false,
    }))

/* A program is a source of its own: events and enrollments are placed by
 * their own dates, so it has no period type, and by the org units it's
 * assigned to. A program indicator that places values elsewhere, or has no
 * period boundaries, is a source apart. */
export const getProgramSource = (
    collector,
    metadata,
    { id, orgUnitField, missingPeriodBoundaries = false }
) => {
    if (!metadata.programs?.[id]) {
        addReason(collector, { code: PROFILE_REASON_MISSING_METADATA, id })
        return
    }

    const atAnyOrgUnit = !usesProgramOrgUnits(orgUnitField)
    const key = [
        `program:${id}`,
        atAnyOrgUnit && orgUnitField,
        missingPeriodBoundaries && 'missingPeriodBoundaries',
    ]
        .filter(Boolean)
        .join(':')

    getSource(collector, key, () => ({
        dataSet: null,
        program: { id },
        ...(atAnyOrgUnit && { orgUnitField }),
        ...(missingPeriodBoundaries && { missingPeriodBoundaries }),
        elements: [],
        reportingRate: false,
    }))
}

export const addElementToSource = (source, element) => {
    const isListed = source.elements.some(
        ({ id, operand, aggregationType }) =>
            id === element.id &&
            operand === element.operand &&
            aggregationType === element.aggregationType
    )

    if (!isListed) {
        source.elements.push(element)
    }
}

export const checkDataSetPeriodType = (collector, id, periodType) => {
    if (!isPeriodType(periodType)) {
        addReason(collector, {
            code: PROFILE_REASON_UNKNOWN_PERIOD_TYPE,
            id,
            periodType,
        })
    }
}
