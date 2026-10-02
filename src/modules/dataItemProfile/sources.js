import { PROGRAM_ORG_UNIT_FIELDS } from './constants.js'

/* A profile source is where an item's data comes from:
 * - a data set: { dataSet: { id, periodType }, elements, reportingRate };
 * - a program: { dataSet: null, program: { id }, elements: [], reportingRate: false },
 *   with `orgUnitField` when its values can be at any org unit, and
 *   `missingPeriodBoundaries` for a program indicator without them;
 * - a data element in no data set: { dataSet: null, elements, reportingRate: false },
 *   which nothing collects. */

export const isProgramSource = ({ program }) => Boolean(program)

// The id of the data set or program behind a source, or null
export const getSourceId = ({ dataSet, program }) =>
    dataSet?.id ?? program?.id ?? null

// The org unit field that lists the org units a source is assigned to
export const getAssignmentField = (source) =>
    isProgramSource(source) ? 'programs' : 'dataSets'

// Whether a program indicator's orgUnitField places values where its program is assigned
export const usesProgramOrgUnits = (orgUnitField) =>
    !orgUnitField || PROGRAM_ORG_UNIT_FIELDS.has(orgUnitField)

// Whether a source's values can be at any org unit, wherever it is assigned
export const canBeAtAnyOrgUnit = ({ orgUnitField }) =>
    !usesProgramOrgUnits(orgUnitField)

/**
 * The operands an item's value is computed from: each data element (by id
 * and aggregation type) with the sources it is in, each reporting rate, and
 * each program. An expression needs them all; one element adds up over its
 * sources.
 */
export const getItemOperands = (profile) => {
    const elements = new Map()

    profile.sources.forEach((source) =>
        source.elements.forEach((element) => {
            const key = `${element.id}:${element.aggregationType}`
            const operand = elements.get(key) ?? { element, sources: [] }

            operand.sources.push(source)
            elements.set(key, operand)
        })
    )

    return [
        ...elements.values(),
        ...profile.sources
            .filter(({ reportingRate }) => reportingRate)
            .map((source) => ({ reportingRate: true, sources: [source] })),
        ...profile.sources
            .filter(isProgramSource)
            .map((source) => ({ program: true, sources: [source] })),
    ]
}
