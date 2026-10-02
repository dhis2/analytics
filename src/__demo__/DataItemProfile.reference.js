import PropTypes from 'prop-types'
import React from 'react'

export const STATUS_DEFINITIONS = [
    [
        'full',
        'Compatible with all the item’s data sets and programs that collect for the selection: every value comes back (also repeated, from an earlier period, or where only some org units are assigned).',
        'Data element in a monthly data set, with aggregation enabled, requested quarterly',
        'Indicator whose components are all in data sets assigned at facility level, requested at district level',
    ],
    [
        'partial',
        'Compatible with only some of the item’s data sets and programs that collect for the selection: the others’ values are left out. Only for an item in several data sets or programs that differ. For an expression, computed from such an operand (OPERAND_PARTIAL).',
        'Data element in a Monday weekly and a Wednesday weekly data set, requested by Monday week',
        'Data element in a data set assigned at facility level and one assigned at district level, requested at a facility',
    ],
    [
        'none',
        'Compatible with none of the item’s data sets and programs that collect for the selection: no value comes back. For an expression, an operand gives none (OPERAND_EMPTY).',
        'Data element in a monthly data set, requested weekly',
        'Data element in a data set assigned at district level, requested at a facility',
    ],
    [
        'unknown',
        'Can’t tell: see the reasons.',
        'Relative weeks when the weekly start setting is missing',
        'An org unit or group that isn’t loaded, or missing metadata',
    ],
]

export const PERIOD_REASON_DEFINITIONS = [
    [
        'OPERAND_EMPTY',
        'An expression whose operand gives no value has none: a ratio without its denominator.',
        'none',
        'ANC 1 Coverage by week: ANC 1st visit is monthly',
    ],
    [
        'OPERAND_PARTIAL',
        'An expression computed from an operand that leaves values out: it can be off either way.',
        'partial',
        'An indicator over IDSR Measles by Monday week',
    ],
    [
        'PERIOD_TOO_SHORT',
        'The period is shorter than the period type of the data sets.',
        'partial, none',
        'ANC 1st visit (monthly) by week',
    ],
    [
        'PERIOD_TYPE_MISMATCH',
        'Another period type of the same length.',
        'partial, none',
        'IDSR Measles’ Wednesday weeks by Monday week',
    ],
    [
        'REPORTING_RATE_TOO_SHORT',
        'A reporting rate asked for a shorter period: a meaningless value.',
        'partial, none',
        'Child Health reporting rate by week',
    ],
    [
        'NO_EARLIER_PERIOD_VALUE',
        'FIRST or LAST data with no data period that counts for the period.',
        'partial, none',
        'Monthly LAST data on 1 January',
    ],
    [
        'REPEATED_VALUE',
        'The value of a longer data period, repeated (period aggregation AVERAGE).',
        'full, partial',
        'Total Population (yearly) by month',
    ],
    [
        'EARLIER_PERIOD_VALUE',
        'The value of an earlier data period (period aggregation FIRST or LAST).',
        'full, partial',
        'Monthly LAST data on 15 July: June’s value',
    ],
    [
        'PROFILE_UNKNOWN',
        'Missing metadata: see the profile’s reasons.',
        'unknown',
        'A data element in no data set',
    ],
    [
        'UNKNOWN_PERIOD',
        'The period id can’t be read.',
        'unknown',
        'A mistyped period id, like 2025X1',
    ],
    [
        'SETTING_MISSING',
        'A relative period’s type depends on a setting that wasn’t given, and its types disagree.',
        'unknown',
        'LAST_4_WEEKS on weekly data, weekly start unknown',
    ],
    [
        'UNSUPPORTED_VERSION',
        'The server version can’t answer it.',
        'unknown',
        '2025NovQ1 on 2.40; a program indicator without period boundaries before 2.43',
    ],
]

export const ORG_UNIT_REASON_DEFINITIONS = [
    [
        'NOT_ASSIGNED',
        'Not assigned there, though assigned at that level elsewhere.',
        'none',
        'ANC 1st visit at Junctionla MCHP',
    ],
    [
        'ASSIGNED_AT_HIGHER_LEVEL',
        'Assigned only at higher levels than the one asked: analytics never splits values down. Partial when another data set fills the org unit.',
        'none, partial',
        'A data set assigned at district level, requested by facility',
    ],
    [
        'STOPPED_BY_AGGREGATION_LEVEL',
        'The data element’s aggregation levels stop values from lower levels reaching the level asked. Partial when another data set fills the org unit.',
        'none, partial',
        'Facility data with aggregation level 2, requested by district',
    ],
    [
        'EMPTY_GROUP',
        'An org unit group without members: analytics refuses it (E7143). Leave it out of the request.',
        'none',
        'A group whose members were all removed',
    ],
    [
        'PARTLY_ASSIGNED',
        'Assigned to only some org units at the deepest level: the others collect nothing, so nothing is left out.',
        'full',
        'ANC 1st visit in Sierra Leone: 1,159 of 1,166 facilities',
    ],
    [
        'ANY_ORG_UNIT',
        'A program indicator placed by registration or an org unit attribute: its values can be at any org unit, wherever its program is assigned.',
        'full',
        'A program indicator by registration org unit',
    ],
    [
        'UNKNOWN_ORG_UNIT',
        'The org unit, level or group isn’t loaded or can’t be read.',
        'unknown',
        'A mistyped id',
    ],
]

const ReferenceTable = ({ title, columns, rows }) => (
    <details>
        <summary>{title}</summary>
        <table>
            <thead>
                <tr>
                    {columns.map((column) => (
                        <th key={column}>{column}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map(([code, ...cells]) => (
                    <tr key={code}>
                        <td>
                            <code>{code}</code>
                        </td>
                        {cells.map((cell, i) => (
                            <td key={columns[i + 1]}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
        <style jsx>{`
            details {
                margin-block-start: 6px;
            }
            table {
                border-collapse: collapse;
                margin-block: 6px;
            }
            th,
            td {
                padding: 2px 12px 2px 0;
                text-align: start;
                vertical-align: top;
            }
        `}</style>
    </details>
)

ReferenceTable.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string),
    rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    title: PropTypes.string,
}

// The API a story shows, apart from the demo itself
const NO_REFERENCES = []

export const ApiPanel = ({
    basedOn,
    runs,
    input,
    signature,
    summary,
    returns,
    uses,
    references = NO_REFERENCES,
}) => (
    <aside>
        <div className="label">API</div>
        <code className="signature">{signature}</code>
        <p>{summary}</p>
        <dl>
            <dt>Based on</dt>
            <dd>{basedOn}</dd>
            <dt>Input</dt>
            <dd>
                <code>{input}</code>
            </dd>
            <dt>Runs</dt>
            <dd>{runs}</dd>
            <dt>Returns</dt>
            <dd>
                <code>{returns}</code>
            </dd>
            <dt>Uses</dt>
            <dd>
                <code>{uses}</code>
            </dd>
        </dl>
        {references.map((reference) => (
            <ReferenceTable key={reference.title} {...reference} />
        ))}
        <style jsx>{`
            aside {
                max-inline-size: 900px;
                margin-block-end: 24px;
                padding: 12px 16px;
                background: #f3f5f7;
                border-inline-start: 4px solid #147cd7;
                font-size: 13px;
                color: #212934;
            }
            .label {
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.05em;
                color: #147cd7;
                text-transform: uppercase;
            }
            .signature {
                display: block;
                margin-block: 4px;
                font-size: 15px;
                font-weight: 600;
            }
            p {
                margin-block: 4px 8px;
            }
            dl {
                display: grid;
                grid-template-columns: max-content 1fr;
                gap: 2px 12px;
                margin: 0;
            }
            dt {
                color: #4a5768;
            }
            dd {
                margin: 0;
            }
        `}</style>
    </aside>
)

ApiPanel.propTypes = {
    basedOn: PropTypes.string,
    input: PropTypes.string,
    references: PropTypes.arrayOf(
        PropTypes.shape({
            columns: PropTypes.arrayOf(PropTypes.string),
            rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
            title: PropTypes.string,
        })
    ),
    returns: PropTypes.string,
    runs: PropTypes.string,
    signature: PropTypes.string,
    summary: PropTypes.string,
    uses: PropTypes.string,
}

export const DemoHeading = () => (
    <h3>
        Demo
        <style jsx>{`
            h3 {
                margin-block: 0 12px;
                font-size: 16px;
            }
        `}</style>
    </h3>
)

// The steps of a scenario, apart from the demo itself
export const ScenarioPanel = ({ title, steps }) => (
    <aside>
        <div className="label">Scenario</div>
        <div className="title">{title}</div>
        <ol>
            {steps.map(([text, code]) => (
                <li key={text}>
                    {text} {code && <code>{code}</code>}
                </li>
            ))}
        </ol>
        <style jsx>{`
            aside {
                max-inline-size: 900px;
                margin-block-end: 24px;
                padding: 12px 16px;
                background: #f3f5f7;
                border-inline-start: 4px solid #147cd7;
                font-size: 13px;
                color: #212934;
            }
            .label {
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.05em;
                color: #147cd7;
                text-transform: uppercase;
            }
            .title {
                margin-block: 4px;
                font-size: 15px;
                font-weight: 600;
            }
            ol {
                margin: 4px 0 0;
                padding-inline-start: 20px;
            }
        `}</style>
    </aside>
)

ScenarioPanel.propTypes = {
    steps: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    title: PropTypes.string,
}
