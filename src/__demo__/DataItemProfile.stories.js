import { InputField } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import { useDataItemProfiles } from '../components/DataItemProfile/useDataItemProfiles.js'
import { readOrgUnitSelection } from '../modules/dataItemProfile/orgUnitSelection.js'
import {
    ApiPanel,
    DemoHeading,
    ORG_UNIT_REASON_DEFINITIONS,
    REASON_DEFINITIONS,
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
const isCollectedByDate = (profile) =>
    !profile.unknown && profile.sources.every(({ program }) => program)

const describeCollection = ({ period, ...profile }) => {
    if (period.types.length) {
        return `${period.types.join(', ')}${period.mixed ? ' (mixed)' : ''}`
    }

    return isCollectedByDate(profile) ? 'event dates' : 'unknown'
}

// How many units at the deepest level entered the data sets are assigned to
const Coverage = ({ coverage }) =>
    coverage ? (
        <div>
            {coverage.assigned.toLocaleString('en')} of{' '}
            {coverage.total.toLocaleString('en')} at level {coverage.level}
            <style jsx>{`
                div {
                    margin-block-start: 4px;
                    font-size: 12px;
                    color: #4a5768;
                }
            `}</style>
        </div>
    ) : null

Coverage.propTypes = { coverage: PropTypes.object }

// The levels its data sets are assigned at, deepest first
const describeLevels = ({ orgUnit }) =>
    orgUnit?.levels.length
        ? `${orgUnit.levels.join(', ')}${orgUnit.mixed ? ' (mixed)' : ''}`
        : '–'

const describeFinest = (profile) =>
    profile.period.finest ?? (isCollectedByDate(profile) ? 'any' : 'unknown')

export const ProfilesAndCompatibility = () => {
    const [periodsText, setPeriodsText] = useState(
        '2025W2, 202501, 2025Q1, 2025, LAST_12_MONTHS, LAST_4_WEEKS, Weekly'
    )
    const periods = useMemo(() => splitList(periodsText), [periodsText])
    const [orgUnitsText, setOrgUnitsText] = useState(
        `${SIERRA_LEONE}, ${BO}, ${JUNCTIONLA_MCHP}, USER_ORGUNIT_CHILDREN`
    )
    const orgUnits = useMemo(() => splitList(orgUnitsText), [orgUnitsText])
    const orgUnitItems = readOrgUnitSelection(orgUnits).items.map(
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
                summary="For each data item: how it is collected (period types, finest type, mixed or not), a function that tells whether chosen periods and org units will return values."
                basedOn="Metadata only (each element's data sets and their period types, indicator expressions; where the data sets are assigned, as counts per level under the org units), the server's weekly and financial year settings, its calendar and version. No analytics request."
                returns="{ loading, error, profiles, orgUnitCoverage, relativePeriodTypes, getDataItemCompatibility(itemId, { periods, orgUnits }) }"
                uses="fetchDataItemProfileMetadata, fetchOrgUnitCoverage, getDataItemProfile, getDataItemProfileCompatibility, getDataItemOrgUnitCompatibility"
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
                        title: 'Reasons (none: measured for the period)',
                        columns: ['Code', 'Meaning', 'With', 'Example'],
                        rows: REASON_DEFINITIONS,
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
                    label="Org units: ids, LEVEL-n or OU_GROUP-id (the ids are then their boundaries), USER_ORGUNIT…"
                    value={orgUnitsText}
                    onChange={({ value }) => setOrgUnitsText(value)}
                    inputWidth="600px"
                />
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
                                <th>Collected at</th>
                                <th>Levels</th>
                                <th>Finest</th>
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
                                        <td>{describeCollection(profile)}</td>
                                        <td>{describeLevels(profile)}</td>
                                        <td>{describeFinest(profile)}</td>
                                        {compatibility.periods.map((result) => (
                                            <td key={result.id}>
                                                <Status {...result} />
                                            </td>
                                        ))}
                                        {compatibility.orgUnits?.map(
                                            (result) => (
                                                <td key={result.id}>
                                                    <Status {...result} />
                                                    <Coverage
                                                        coverage={
                                                            result.coverage
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
