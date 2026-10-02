import PropTypes from 'prop-types'
import React from 'react'

export const STATUS_DEFINITIONS = [
    [
        'full',
        'Fully compatible with all the item’s data sets and programs that collect for the selection: every value collected comes back (also averaged, carried, or where only some units collect it).',
        'Data element captured monthly, with aggregation enabled, requested quarterly',
        'Indicator with all its components captured at facility level, with aggregation enabled, requested at district level',
    ],
    [
        'partial',
        'Compatible with only some of the item’s data sets and programs that collect for the selection: the others’ values are left out. Only for an item collected in several data sets or programs that differ (mixed). For an expression, computed from such an operand (OPERAND_PARTIAL).',
        'Data element captured weekly from Monday in one data set and from Wednesday in another, requested by Monday week',
        'Data element captured at facility level in one data set and at district level in another, requested at a facility',
    ],
    [
        'none',
        'Compatible with none of the item’s data sets and programs that collect for the selection: no value comes back. For an expression, an operand gives none (OPERAND_EMPTY).',
        'Data element captured monthly, requested weekly',
        'Data element captured at district level, requested at a facility',
    ],
    [
        'unknown',
        'Can’t tell: see the reasons.',
        'Relative weeks when the weekly start setting is missing',
        'An org unit group, or an event data item without its program in its id',
    ],
]

export const REASON_DEFINITIONS = [
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
        'AVERAGED',
        'Repeated from the data period that holds it.',
        'full, partial',
        'Total Population (yearly) by month',
    ],
    [
        'CARRIED',
        'From another data period (FIRST, LAST).',
        'full, partial',
        'Monthly LAST data on 15 July: June’s value',
    ],
    [
        'SHORTER',
        'Period shorter than the data’s type.',
        'partial, none',
        'ANC 1st visit (monthly) by week',
    ],
    [
        'OTHER_TYPE',
        'Same length, other type.',
        'partial, none',
        'IDSR Measles’ Wednesday weeks by Monday week',
    ],
    [
        'REPORTING_RATE',
        'Reporting rate in a shorter period.',
        'partial, none',
        'Child Health reporting rate by week',
    ],
    [
        'NOTHING_TO_CARRY',
        'FIRST or LAST with no data period that counts.',
        'partial, none',
        'Monthly LAST data on 1 January',
    ],
    [
        'PROFILE_UNKNOWN',
        'Missing metadata: see the profile’s reasons.',
        'unknown',
        'An element in no data set',
    ],
    [
        'UNKNOWN_PERIOD',
        'Unreadable period id.',
        'unknown',
        'A mistyped period id, like 2025X1',
    ],
    [
        'SETTING_MISSING',
        'Relative period type needs a setting not given.',
        'unknown',
        'LAST_4_WEEKS on weekly data, weekly start unknown',
    ],
    [
        'UNSUPPORTED_VERSION',
        'Type this server version can’t answer.',
        'unknown',
        '2025NovQ1 on 2.40',
    ],
]

export const ORG_UNIT_REASON_DEFINITIONS = [
    [
        'NOT_ASSIGNED',
        'Its data sets aren’t assigned there, though they are at that level elsewhere.',
        'none',
        'ANC 1st visit at Junctionla MCHP',
    ],
    [
        'BELOW_COLLECTION',
        'Data is entered above the level asked: nothing is split down. Partial when another data set fills the place.',
        'none, partial',
        'District data by facility',
    ],
    [
        'AGGREGATION_LEVEL',
        'The data element’s aggregation levels stop values entered below them from reaching the level asked. Partial when another data set fills the place.',
        'none, partial',
        'Facility data with aggregation level 2, asked by district',
    ],
    [
        'PARTLY_ASSIGNED',
        'Assigned to only some of the units at the deepest level entered: the others don’t collect it, so nothing is left out.',
        'full',
        'ANC 1st visit in Sierra Leone: 1,159 of 1,166 facilities',
    ],
    [
        'ORG_UNIT_FIELD',
        'A program indicator places its values by another org unit than the event’s or enrollment’s (registration, or an org unit attribute): they can be anywhere, wherever its program is assigned.',
        'full',
        'A program indicator by registration org unit',
    ],
    [
        'UNKNOWN_ORG_UNIT',
        'An org unit or level that isn’t loaded or can’t be read.',
        'unknown',
        'A mistyped id',
    ],
    [
        'EVENT_DATA',
        'Event data whose program can’t be told from its id.',
        'unknown',
        'An event data item named by its data element alone',
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
                            <td key={i}>{cell}</td>
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
