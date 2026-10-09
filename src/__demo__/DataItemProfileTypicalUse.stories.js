import { Checkbox, InputField, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import { useDataItemProfiles } from '../components/DataItemProfile/useDataItemProfiles.js'
import { ScenarioPanel } from './DataItemProfile.reference.js'
import {
    ErrorNotice,
    ITEMS,
    Loading,
    SIERRA_LEONE,
    splitList,
    Status,
    tableStyle,
    Wrapper,
} from './DataItemProfile.shared.js'

export default {
    title: 'DataItemProfile/Typical use in Data Visualizer',
    decorators: [Wrapper],
}

const STEPS = [
    [
        'The user picks data items: DV loads their profiles, and where their data sets and programs are assigned under the org units.',
        'useDataItemProfiles(items, { orgUnits })',
    ],
    [
        'The pickers mark each period type and each org unit level for those items.',
        "getDataItemCompatibility(itemId, { periods: [periodType], orgUnits: [parentOrgUnit, 'LEVEL-n'] })",
    ],
    [
        'Periods and org units selected, before Update: DV checks them, from current metadata only.',
        'getDataItemCompatibility(itemId, { periods, orgUnits })',
    ],
]

// The period types the picker offers in this demo, shortest first
const PICKER_PERIOD_TYPES = [
    'Daily',
    'Weekly',
    'WeeklyWednesday',
    'BiWeekly',
    'Monthly',
    'Quarterly',
    'SixMonthly',
    'Yearly',
    'FinancialApril',
]

// The types of the data sets that can't fill the period: compatible with none
const getTypesLeftOut = ({ sources }, profile) => [
    ...new Set(
        sources
            .map(({ status }, i) =>
                status === 'none'
                    ? profile.sources[i].dataSet?.periodType
                    : null
            )
            .filter(Boolean)
    ),
]

// What DV could say about an item, for one period
const adviceFor = (result, profile) => {
    const { status, reasons } = result
    const typesLeftOut = getTypesLeftOut(result, profile).join(' and ')

    switch (status) {
        case 'full':
            if (reasons.includes('EARLIER_PERIOD_VALUE')) {
                return 'Shown, from an earlier data period.'
            }
            return reasons.includes('REPEATED_VALUE')
                ? 'Shown, repeated from the data period that holds it.'
                : 'Shown.'
        case 'partial':
            return reasons.includes('OPERAND_PARTIAL')
                ? 'Shown, but computed from incomplete data: it can be off either way.'
                : `Partly shown: the ${typesLeftOut} data can’t fill this period.`
        case 'none':
            if (reasons.includes('REPORTING_RATE_TOO_SHORT')) {
                return 'Not shown: a reporting rate can’t be shown by this period.'
            }
            if (reasons.includes('NO_EARLIER_PERIOD_VALUE')) {
                return 'Not shown: no earlier value in these years.'
            }
            return `Not shown: its data sets are ${typesLeftOut}.`
        default:
            return 'Can’t tell.'
    }
}

const PeriodTypeMarks = ({ items, getDataItemCompatibility }) => (
    <table className="profiles">
        <thead>
            <tr>
                <th>Period type</th>
                {items.map(({ id, name }) => (
                    <th key={id}>{name}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {PICKER_PERIOD_TYPES.map((periodType) => (
                <tr key={periodType}>
                    <td>{periodType}</td>
                    {items.map(({ id }) => (
                        <td key={id}>
                            <Status
                                {...getDataItemCompatibility(id, {
                                    periods: [periodType],
                                })}
                            />
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
)

const formatCount = (count) => count.toLocaleString('en')

// The total is there only when the org units were counted too (withAssignmentTotals)
const describeAssignment = ({ assigned, total, level }, levels) => {
    const levelName = levels.find((item) => item.level === level)?.name
    const counts =
        total === undefined
            ? formatCount(assigned)
            : `${formatCount(assigned)} of ${formatCount(total)}`

    return `${counts} org units at level ${levelName ?? level}`
}

const ORG_UNIT_NONE_ADVICE = {
    ASSIGNED_AT_HIGHER_LEVEL:
        'Not shown: its data sets are assigned at a higher level.',
    STOPPED_BY_AGGREGATION_LEVEL:
        'Not shown: its aggregation levels stop values before this level.',
    EMPTY_GROUP: 'Leave it out: the group has no members.',
    NO_ORG_UNITS_AT_LEVEL: 'Not shown: no org unit at this level there.',
}

const getFullAdvice = (reasons, assignment, levels) => {
    if (reasons.includes('ANY_ORG_UNIT') || !assignment) {
        return 'Shown.'
    }

    const assignedTo = describeAssignment(assignment, levels)

    return reasons.includes('PARTLY_ASSIGNED')
        ? `Shown: assigned to ${assignedTo}; the others aren’t assigned.`
        : `Shown: assigned to ${assignedTo}.`
}

// What DV could say about an item, for one org unit selection item
const orgUnitAdviceFor = ({ status, reasons, assignment }, levels) => {
    switch (status) {
        case 'full':
            return getFullAdvice(reasons, assignment, levels)
        case 'partial':
            return reasons.includes('OPERAND_PARTIAL')
                ? 'Shown, but computed from incomplete data: it can be off either way.'
                : 'Partly shown: values of data sets assigned at a higher level are left out.'
        case 'none': {
            const reason = reasons.find((code) => ORG_UNIT_NONE_ADVICE[code])

            return reason
                ? ORG_UNIT_NONE_ADVICE[reason]
                : 'Not shown: its data sets aren’t assigned here.'
        }
        default:
            return 'Can’t tell.'
    }
}

const OrgUnitLevelMarks = ({ items, levels, getDataItemCompatibility }) => (
    <table className="profiles">
        <thead>
            <tr>
                <th>Level</th>
                {items.map(({ id, name }) => (
                    <th key={id}>{name}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {levels.map(({ level, name }) => (
                <tr key={level}>
                    <td>{name}</td>
                    {items.map(({ id }) => (
                        <td key={id}>
                            <Status
                                {...getDataItemCompatibility(id, {
                                    orgUnits: [SIERRA_LEONE, `LEVEL-${level}`],
                                }).orgUnits[0]}
                            />
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
)

OrgUnitLevelMarks.propTypes = {
    getDataItemCompatibility: PropTypes.func,
    items: PropTypes.array,
    levels: PropTypes.array,
}

PeriodTypeMarks.propTypes = {
    getDataItemCompatibility: PropTypes.func,
    items: PropTypes.array,
}

// One column per dimension
const Columns = ({ period, orgUnit }) => (
    <div className="columns">
        <section>
            <h4>Period</h4>
            {period}
        </section>
        <section>
            <h4>Org unit</h4>
            {orgUnit ?? <p>Coming soon.</p>}
        </section>
        <style jsx>{`
            .columns {
                display: grid;
                grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
                gap: 24px;
                align-items: start;
            }
            h4 {
                margin-block: 0 8px;
                font-size: 14px;
                color: #4a5768;
            }
            section {
                overflow-x: auto;
            }
            section + section {
                border-inline-start: 1px solid #d5dde5;
                padding-inline-start: 16px;
            }
        `}</style>
    </div>
)

Columns.propTypes = { orgUnit: PropTypes.node, period: PropTypes.node }

// Before Update, both checks read today's metadata only
const MetadataOnlyNotice = () => (
    <NoticeBox title="Derived from current metadata only">
        Past data may have been entered with a different configuration.
    </NoticeBox>
)

export const TypicalUse = () => {
    const [selectedIds, setSelectedIds] = useState([
        'fbfJHSPpUQD',
        'Uvn6LCg7dVU',
        'YazgqXbizv1',
    ])
    const [periodsText, setPeriodsText] = useState('2025W2')
    const [orgUnitsText, setOrgUnitsText] = useState(SIERRA_LEONE)
    const items = useMemo(
        () => ITEMS.filter(({ id }) => selectedIds.includes(id)),
        [selectedIds]
    )
    const periods = useMemo(() => splitList(periodsText), [periodsText])
    const orgUnits = useMemo(() => splitList(orgUnitsText), [orgUnitsText])
    // The country, for the levels in the picker, and the org units selected
    const loadedOrgUnits = useMemo(
        () => [...new Set([SIERRA_LEONE, ...orgUnits])],
        [orgUnits]
    )
    const {
        loading,
        error,
        profiles,
        orgUnitCoverage,
        getDataItemCompatibility,
    } = useDataItemProfiles(items, { orgUnits: loadedOrgUnits })
    // While a newly picked item loads, the others keep their profiles
    const loadedItems = items.filter(({ id }) => profiles?.[id])

    const toggle = (id) =>
        setSelectedIds((ids) =>
            ids.includes(id)
                ? ids.filter((other) => other !== id)
                : [...ids, id]
        )
    return (
        <div>
            {tableStyle}
            <ScenarioPanel
                title="A user builds a chart in Data Visualizer"
                steps={STEPS}
            />

            <h3>Data items</h3>
            {ITEMS.map(({ id, name }) => (
                <Checkbox
                    key={id}
                    label={name}
                    checked={selectedIds.includes(id)}
                    onChange={() => toggle(id)}
                />
            ))}
            {loading && <Loading />}
            {error && <ErrorNotice error={error} />}

            {loadedItems.length > 0 && (
                <>
                    <h3>Pickers</h3>
                    <Columns
                        period={
                            <PeriodTypeMarks
                                items={loadedItems}
                                getDataItemCompatibility={
                                    getDataItemCompatibility
                                }
                            />
                        }
                        orgUnit={
                            orgUnitCoverage ? (
                                <OrgUnitLevelMarks
                                    items={loadedItems}
                                    levels={orgUnitCoverage.levels}
                                    getDataItemCompatibility={
                                        getDataItemCompatibility
                                    }
                                />
                            ) : (
                                <Loading />
                            )
                        }
                    />

                    <h3>Selected, before Update</h3>
                    <Columns
                        period={
                            <>
                                <div className="inputs">
                                    <InputField
                                        label="Fixed or relative periods"
                                        value={periodsText}
                                        onChange={({ value }) =>
                                            setPeriodsText(value)
                                        }
                                    />
                                </div>
                                <MetadataOnlyNotice />
                                <table className="profiles">
                                    <tbody>
                                        {loadedItems.map(({ id, name }) => (
                                            <tr key={id}>
                                                <td>{name}</td>
                                                <td>
                                                    {getDataItemCompatibility(
                                                        id,
                                                        { periods }
                                                    )?.periods.map((result) => (
                                                        <div key={result.id}>
                                                            <code>
                                                                {result.id}
                                                            </code>{' '}
                                                            <Status
                                                                {...result}
                                                            />{' '}
                                                            {adviceFor(
                                                                result,
                                                                profiles[id]
                                                            )}{' '}
                                                        </div>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        }
                        orgUnit={
                            <>
                                <div className="inputs">
                                    <InputField
                                        label="Org units: ids, LEVEL-n, OU_GROUP-id, USER_ORGUNIT…"
                                        value={orgUnitsText}
                                        onChange={({ value }) =>
                                            setOrgUnitsText(value)
                                        }
                                    />
                                </div>
                                <MetadataOnlyNotice />
                                <table className="profiles">
                                    <tbody>
                                        {loadedItems.map(({ id, name }) => (
                                            <tr key={id}>
                                                <td>{name}</td>
                                                <td>
                                                    {orgUnitCoverage
                                                        ? getDataItemCompatibility(
                                                              id,
                                                              { orgUnits }
                                                          )?.orgUnits?.map(
                                                              (result) => (
                                                                  <div
                                                                      key={
                                                                          result.id
                                                                      }
                                                                  >
                                                                      <code>
                                                                          {
                                                                              result.id
                                                                          }
                                                                      </code>{' '}
                                                                      <Status
                                                                          {...result}
                                                                      />{' '}
                                                                      {orgUnitAdviceFor(
                                                                          result,
                                                                          orgUnitCoverage.levels
                                                                      )}
                                                                  </div>
                                                              )
                                                          )
                                                        : null}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </>
                        }
                    />
                </>
            )}
        </div>
    )
}

TypicalUse.storyName = 'Typical use in Data Visualizer'
