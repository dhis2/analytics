import { Button, InputField } from '@dhis2/ui'
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

    return isPlacedByDate(profile) ? 'event dates' : 'unknown'
}

// How many org units at the deepest level assigned the data sets are assigned to
const Assignment = ({ assignment }) =>
    assignment ? (
        <div>
            {assignment.assigned.toLocaleString('en')} of{' '}
            {assignment.total.toLocaleString('en')} at level {assignment.level}
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

// The levels its data sets and programs are assigned at, deepest first
const describeLevels = ({ assignedOrgUnitLevels }) =>
    assignedOrgUnitLevels?.levels.length
        ? listWithSeveral(assignedOrgUnitLevels, assignedOrgUnitLevels.levels)
        : '–'

const describeShortestDirectType = (profile) => {
    if (profile.assignedPeriodTypes.shortestDirectType) {
        return profile.assignedPeriodTypes.shortestDirectType
    }

    return isPlacedByDate(profile) ? 'any' : 'unknown'
}

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

export const ProfilesAndCompatibility = () => {
    const [periodsText, setPeriodsText] = useState(
        '2025W2, 202501, 2025Q1, 2025, LAST_12_MONTHS, LAST_4_WEEKS, Weekly'
    )
    const periods = useMemo(() => splitList(periodsText), [periodsText])
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
    const {
        loading,
        error,
        profiles,
        relativePeriodTypes,
        getDataItemCompatibility,
    } = useDataItemProfiles(ITEMS, { orgUnits })

    return (
        <div>
            {tableStyle}
            <ApiPanel
                signature="useDataItemProfiles(items, { orgUnits })"
                runs="When the items or the org units change (metadata only)"
                input="items: [{ id, dimensionItemType }], as in a visualization's dx items; orgUnits: DV's org unit items (ids, LEVEL-n, OU_GROUP-id, USER_ORGUNIT…)"
                summary="For each data item: the period types and org unit levels its data sets and programs are assigned at, and a function that tells whether chosen periods and org units will return all its values."
                basedOn="Metadata only (each element's data sets and their period types, indicator expressions; where the data sets and programs are assigned, as counts per level under the org units), the server's weekly and financial year settings, its calendar and version. No analytics request."
                returns="{ loading, error, profiles, orgUnitCoverage, relativePeriodTypes, getDataItemCompatibility(itemId, { periods, orgUnits }) }"
                uses="fetchDataItemProfileMetadata, fetchOrgUnitCoverage, getDataItemProfile, getDataItemProfileCompatibility (getDataItemProfilePeriodCompatibility, getDataItemProfileOrgUnitCompatibility)"
                references={[
                    {
                        title: 'Compatibility statuses',
                        columns: [
                            'Status',
                            'Meaning',
                            'Period example',
                            'Org unit example',
                        ],
                        rows: STATUS_DEFINITIONS,
                    },
                    {
                        title: 'Period reasons (none: added up for the period)',
                        columns: ['Code', 'Meaning', 'With', 'Example'],
                        rows: PERIOD_REASON_DEFINITIONS,
                    },
                    {
                        title: 'Org unit reasons',
                        columns: ['Code', 'Meaning', 'With', 'Example'],
                        rows: ORG_UNIT_REASON_DEFINITIONS,
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
            <div className="inputs">
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
                <style jsx>{`
                    .scenarios {
                        display: flex;
                        gap: 8px;
                        margin-block-start: 8px;
                    }
                `}</style>
            </div>
            {loading && <Loading />}
            {error && <ErrorNotice error={error} />}
            {profiles && (
                <>
                    <p>
                        Relative weeks:{' '}
                        {relativePeriodTypes.weeklyPeriodType ?? 'unknown'}.
                        Relative financial years:{' '}
                        {relativePeriodTypes.financialYearPeriodType ??
                            'unknown'}
                        .
                    </p>
                    <table className="profiles">
                        <thead>
                            <tr>
                                <th rowSpan={2}>Item</th>
                                <th colSpan={4} className="group">
                                    Profile <code>getDataItemProfile</code>
                                </th>
                                {periods.length > 0 && (
                                    <th
                                        colSpan={periods.length}
                                        className="group"
                                    >
                                        Compatibility{' '}
                                        <code>getDataItemCompatibility</code>
                                    </th>
                                )}
                                {orgUnitItems.length > 0 && (
                                    <th
                                        colSpan={orgUnitItems.length}
                                        className="group"
                                    >
                                        Org units{' '}
                                        <code>getDataItemCompatibility</code>
                                    </th>
                                )}
                            </tr>
                            <tr>
                                <th>JSON</th>
                                <th>Period types</th>
                                <th>Org unit levels</th>
                                <th>Shortest direct type</th>
                                {periods.map((period) => (
                                    <th key={period}>{period}</th>
                                ))}
                                {orgUnitItems.map((orgUnit) => (
                                    <th key={orgUnit}>{orgUnit}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {ITEMS.map(({ id, name }) => {
                                const profile = profiles[id]
                                const compatibility = getDataItemCompatibility(
                                    id,
                                    { periods, orgUnits }
                                )

                                return (
                                    <tr key={id}>
                                        <td>
                                            {name}
                                            {profile.unknown && (
                                                <div>
                                                    <Status
                                                        status="unknown"
                                                        reasons={profile.reasons.map(
                                                            ({ code }) => code
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <details>
                                                <summary>Show</summary>
                                                <pre className="json">
                                                    {JSON.stringify(
                                                        profile,
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                            </details>
                                        </td>
                                        <td>{describePeriodTypes(profile)}</td>
                                        <td>{describeLevels(profile)}</td>
                                        <td>
                                            {describeShortestDirectType(
                                                profile
                                            )}
                                        </td>
                                        {compatibility.periods.map((result) => (
                                            <td key={result.id}>
                                                <Status {...result} />
                                            </td>
                                        ))}
                                        {compatibility.orgUnits?.map(
                                            (result) => (
                                                <td key={result.id}>
                                                    <Status {...result} />
                                                    <Assignment
                                                        assignment={
                                                            result.assignment
                                                        }
                                                    />
                                                </td>
                                            )
                                        )}
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

ProfilesAndCompatibility.storyName = 'Profiles and compatibility'
