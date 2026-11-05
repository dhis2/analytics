import { Button, Checkbox, InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import { useDataItemProfiles } from '../components/DataItemProfile/useDataItemProfiles.js'
import { readOrgUnitSelection } from '../modules/dataItemProfile/orgUnits/orgUnitSelection.js'
import {
    ApiPanel,
    DemoHeading,
    ORG_UNIT_REASON_DEFINITIONS,
    PERIOD_REASON_DEFINITIONS,
    STATUS_DEFINITIONS,
} from './DataItemProfile.reference.js'
import {
    ErrorNotice,
    BO,
    ITEMS,
    JUNCTIONLA_MCHP,
    Loading,
    SIERRA_LEONE,
    splitList,
    Status,
    tableStyle,
    Wrapper,
} from './DataItemProfile.shared.js'

export default {
    title: 'DataItemProfile/Hooks',
    decorators: [Wrapper],
}

// The status table with one example column: periods or org units
const statusReference = (exampleColumn, exampleIndex) => ({
    title: 'Compatibility statuses',
    columns: ['Status', 'Meaning', exampleColumn],
    rows: STATUS_DEFINITIONS.map(([status, meaning, ...examples]) => [
        status,
        meaning,
        examples[exampleIndex],
    ]),
})

// Event data comes from programs: it is placed in any period by its dates
const isPlacedByDate = (profile) =>
    !profile.unknown && profile.sources.every(({ program }) => program)

const listWithSeveral = ({ hasSeveral }, values) =>
    `${values.join(', ')}${hasSeveral ? ' (several)' : ''}`

const describePeriodTypes = (profile) => {
    const { assignedPeriodTypes } = profile

    if (assignedPeriodTypes.types.length) {
        return listWithSeveral(assignedPeriodTypes, assignedPeriodTypes.types)
    }

    return isPlacedByDate(profile) ? 'Event dates' : 'Unknown'
}

const describeShortestDirectType = (profile) => {
    if (profile.assignedPeriodTypes.shortestDirectType) {
        return profile.assignedPeriodTypes.shortestDirectType
    }

    return isPlacedByDate(profile) ? 'Any' : 'Unknown'
}

// The levels its data sets and programs are assigned at, deepest first
const describeLevels = ({ assignedOrgUnitLevels }) =>
    assignedOrgUnitLevels?.levels.length
        ? listWithSeveral(assignedOrgUnitLevels, assignedOrgUnitLevels.levels)
        : '–'

/* How many org units at the deepest level assigned the data sets are
 * assigned to, of how many when the coverage counted them */
const Assignment = ({ assignment }) =>
    assignment ? (
        <div>
            {assignment.assigned.toLocaleString('en')}
            {assignment.total !== undefined &&
                ` of ${assignment.total.toLocaleString('en')}`}{' '}
            at level {assignment.level}
            <style jsx>{`
                div {
                    margin-block-start: 4px;
                    font-size: 12px;
                    color: #4a5768;
                }
            `}</style>
        </div>
    ) : null

Assignment.propTypes = { assignment: PropTypes.object }

// The item's name, its status when the profile is unknown, and the profile as JSON
const ItemCells = ({ name, profile }) => (
    <>
        <td>
            {name}
            {profile.unknown && (
                <div>
                    <Status
                        status="unknown"
                        reasons={profile.reasons.map(({ code }) => code)}
                    />
                </div>
            )}
        </td>
        <td>
            <details>
                <summary>Show</summary>
                <pre className="json">{JSON.stringify(profile, null, 2)}</pre>
            </details>
        </td>
    </>
)

ItemCells.propTypes = {
    name: PropTypes.string,
    profile: PropTypes.object,
}

// What a story judges is judged alone: this says so above its table
const AloneNote = ({ children }) => (
    <p>
        {children}
        <style jsx>{`
            p {
                max-inline-size: 900px;
                font-size: 13px;
                color: #4a5768;
            }
        `}</style>
    </p>
)

AloneNote.propTypes = { children: PropTypes.node }

const PERIOD_EXAMPLES = 0
const ORG_UNIT_EXAMPLES = 1

export const Periods = () => {
    const [periodsText, setPeriodsText] = useState(
        '2025W2, 202501, 2025Q1, 2025, LAST_12_MONTHS, LAST_4_WEEKS, Weekly'
    )
    const periods = useMemo(() => splitList(periodsText), [periodsText])
    // No org units: periods need no request beyond the metadata
    const {
        loading,
        error,
        profiles,
        relativePeriodTypes,
        getDataItemCompatibility,
    } = useDataItemProfiles(ITEMS)

    return (
        <div>
            {tableStyle}
            <ApiPanel
                signature="useDataItemProfiles(items) → getDataItemCompatibility(itemId, { periods })"
                runs="When the items change (metadata only); periods are judged on each call, with no request"
                input="items: [{ id, dimensionItemType }], as in a visualization's dx items; periods: fixed ids, relative ids or period types"
                summary="For each data item: the period types its data sets are assigned at, and whether each period will return all its values."
                basedOn="Metadata only (each element's data sets and their period types, aggregation types, indicator expressions), the server's weekly and financial year settings, its calendar and version. No analytics request."
                returns="getDataItemCompatibility(itemId, { periods }).periods: [{ id, periodTypes, status, reasons, alignsWithData, sources }]"
                uses="fetchDataItemProfileMetadata, getDataItemProfile, getDataItemProfilePeriodCompatibility"
                references={[
                    statusReference('Example', PERIOD_EXAMPLES),
                    {
                        title: 'Period reasons (none: added up for the period)',
                        columns: ['Code', 'Meaning', 'With', 'Example'],
                        rows: PERIOD_REASON_DEFINITIONS,
                    },
                ]}
            />
            <DemoHeading />
            <div className="inputs">
                <InputField
                    label="Periods: fixed ids, relative ids or period types"
                    value={periodsText}
                    onChange={({ value }) => setPeriodsText(value)}
                    inputWidth="600px"
                />
            </div>
            {loading && <Loading />}
            {error && <ErrorNotice error={error} />}
            {profiles && (
                <>
                    <AloneNote>
                        Each period is judged alone, over all the item’s data
                        sets and programs, whatever the org units: where they
                        are assigned isn’t read here. Relative weeks:{' '}
                        {relativePeriodTypes.weeklyPeriodType ?? 'unknown'}.
                        Relative financial years:{' '}
                        {relativePeriodTypes.financialYearPeriodType ??
                            'unknown'}
                        .
                    </AloneNote>
                    <table className="profiles">
                        <thead>
                            <tr>
                                <th rowSpan={2}>Item</th>
                                <th colSpan={3} className="group">
                                    Profile <code>getDataItemProfile</code>
                                </th>
                                {periods.length > 0 && (
                                    <th
                                        colSpan={periods.length}
                                        className="group"
                                    >
                                        Each period{' '}
                                        <code>getDataItemCompatibility</code>
                                    </th>
                                )}
                            </tr>
                            <tr>
                                <th>JSON</th>
                                <th>Period types</th>
                                <th>Shortest direct type</th>
                                {periods.map((period) => (
                                    <th key={period}>{period}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {ITEMS.map(({ id, name }) => {
                                const profile = profiles[id]
                                const { periods: results } =
                                    getDataItemCompatibility(id, { periods })

                                return (
                                    <tr key={id}>
                                        <ItemCells
                                            name={name}
                                            profile={profile}
                                        />
                                        <td>{describePeriodTypes(profile)}</td>
                                        <td>
                                            {describeShortestDirectType(
                                                profile
                                            )}
                                        </td>
                                        {results.map((result) => (
                                            <td key={result.id}>
                                                <Status {...result} />
                                            </td>
                                        ))}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    )
}

Periods.storyName = 'Periods'

// Org unit selections to try, one per kind of selection item
const ORG_UNIT_SCENARIOS = [
    [
        'Org units',
        `${SIERRA_LEONE}, ${BO}, ${JUNCTIONLA_MCHP}, USER_ORGUNIT_CHILDREN`,
    ],
    ['Levels in Bo', `${BO}, LEVEL-3, LEVEL-4`],
    ['District group', 'OU_GROUP-w1Atoz18PCL'],
    ['Clinic group in Bo', `${BO}, OU_GROUP-RXL3lPSK8oG`],
]

export const OrgUnits = () => {
    // Typed org units apply on blur: each change sends requests
    const [orgUnitsText, setOrgUnitsText] = useState(ORG_UNIT_SCENARIOS[0][1])
    const [orgUnitsDraft, setOrgUnitsDraft] = useState(orgUnitsText)
    const applyOrgUnits = (text) => {
        setOrgUnitsDraft(text)
        setOrgUnitsText(text)
    }
    const orgUnits = useMemo(() => splitList(orgUnitsText), [orgUnitsText])
    const orgUnitItems = readOrgUnitSelection(orgUnits).selectionItems.map(
        ({ id }) => id
    )
    const [withAssignmentTotals, setWithAssignmentTotals] = useState(false)
    const { loading, error, profiles, getDataItemCompatibility } =
        useDataItemProfiles(ITEMS, { orgUnits, withAssignmentTotals })

    return (
        <div>
            {tableStyle}
            <ApiPanel
                signature="useDataItemProfiles(items, { orgUnits, withAssignmentTotals }) → getDataItemCompatibility(itemId, { orgUnits })"
                runs="When the items or the org units change (metadata only)"
                input="items: [{ id, dimensionItemType }], as in a visualization's dx items; orgUnits: DV's org unit items (ids, LEVEL-n, OU_GROUP-id, USER_ORGUNIT…); withAssignmentTotals: also count the org units under them, for x of y and PARTLY_ASSIGNED"
                summary="For each data item: the org unit levels its data sets and programs are assigned at, and whether each selected org unit, level or group will return all its values."
                basedOn="Metadata only: where the data sets and programs are assigned, as counts per level under the org units, and the elements' aggregation levels. No analytics request."
                returns="getDataItemCompatibility(itemId, { orgUnits }).orgUnits: [{ id, status, reasons, assignment }], and orgUnitCoverage from the hook"
                uses="fetchDataItemProfileMetadata, fetchOrgUnitCoverage, getDataItemProfile, getDataItemProfileOrgUnitCompatibility"
                references={[
                    statusReference('Example', ORG_UNIT_EXAMPLES),
                    {
                        title: 'Org unit reasons',
                        columns: ['Code', 'Meaning', 'With', 'Example'],
                        rows: ORG_UNIT_REASON_DEFINITIONS,
                    },
                ]}
            />
            <DemoHeading />
            <div className="orgUnitInputs">
                <InputField
                    label="Org units: ids, LEVEL-n or OU_GROUP-id (the ids are then their parents), USER_ORGUNIT…"
                    helpText="Applied when the field loses focus"
                    value={orgUnitsDraft}
                    onChange={({ value }) => setOrgUnitsDraft(value)}
                    onBlur={({ value }) => applyOrgUnits(value)}
                    inputWidth="600px"
                />
                <div className="scenarios">
                    {ORG_UNIT_SCENARIOS.map(([label, text]) => (
                        <Button
                            key={label}
                            small
                            onClick={() => applyOrgUnits(text)}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
                <Checkbox
                    label="Count the org units too (x of y, PARTLY_ASSIGNED): more requests"
                    checked={withAssignmentTotals}
                    onChange={({ checked }) => setWithAssignmentTotals(checked)}
                    dense
                />
                <style jsx>{`
                    .orgUnitInputs {
                        margin-block-end: 16px;
                    }
                    .scenarios {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                        margin-block-start: 8px;
                    }
                `}</style>
            </div>
            {loading && <Loading />}
            {error && <ErrorNotice error={error} />}
            {profiles && (
                <>
                    <AloneNote>
                        Each org unit, level or group is judged alone, over all
                        the item’s data sets and programs, whatever the periods:
                        their period types aren’t read here.
                    </AloneNote>
                    <table className="profiles">
                        <thead>
                            <tr>
                                <th rowSpan={2}>Item</th>
                                <th colSpan={2} className="group">
                                    Profile <code>getDataItemProfile</code>
                                </th>
                                {orgUnitItems.length > 0 && (
                                    <th
                                        colSpan={orgUnitItems.length}
                                        className="group"
                                    >
                                        Each org unit{' '}
                                        <code>getDataItemCompatibility</code>
                                    </th>
                                )}
                            </tr>
                            <tr>
                                <th>JSON</th>
                                <th>Org unit levels</th>
                                {orgUnitItems.map((orgUnit) => (
                                    <th key={orgUnit}>{orgUnit}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {ITEMS.map(({ id, name }) => {
                                const profile = profiles[id]
                                const { orgUnits: results = [] } =
                                    getDataItemCompatibility(id, { orgUnits })

                                return (
                                    <tr key={id}>
                                        <ItemCells
                                            name={name}
                                            profile={profile}
                                        />
                                        <td>{describeLevels(profile)}</td>
                                        {results.map((result) => (
                                            <td key={result.id}>
                                                <Status {...result} />
                                                <Assignment
                                                    assignment={
                                                        result.assignment
                                                    }
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    )
}

OrgUnits.storyName = 'Org units'
