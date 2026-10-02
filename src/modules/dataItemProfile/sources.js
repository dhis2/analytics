/* A profile source is a data set ({ dataSet, elements, reportingRate }) or a
 * program ({ program, elements: [], reportingRate: false }), or an element in
 * no data set (dataSet null) */

export const isProgramSource = ({ program }) => Boolean(program)

// The id of the data set or program behind a source, or null
export const getSourceId = ({ dataSet, program }) =>
    dataSet?.id ?? program?.id ?? null

/* A program indicator's orgUnitField places values by the event's or
 * enrollment's org unit (unset, EVENT, ENROLLMENT), or by the owner's, which
 * fall back to it: those are where the program is assigned. REGISTRATION and
 * an org unit data element or attribute (its id) can be anywhere. */
const BOUNDED_ORG_UNIT_FIELDS = [
    'EVENT',
    'ENROLLMENT',
    'OWNER_AT_START',
    'OWNER_AT_END',
]

export const isBoundedOrgUnitField = (orgUnitField) =>
    !orgUnitField || BOUNDED_ORG_UNIT_FIELDS.includes(orgUnitField)

// Whether a source's values can be at any org unit, its assignment aside
export const isPlacedAnywhere = ({ orgUnitField }) =>
    !isBoundedOrgUnitField(orgUnitField)

// The metadata field units are assigned to a source by, for counts
export const getSourceField = (source) =>
    isProgramSource(source) ? 'programs' : 'dataSets'
