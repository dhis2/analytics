import PropTypes from 'prop-types'
import React from 'react'
import { PivotTableCell } from './PivotTableCell'
import { usePivotTableEngine } from './PivotTableEngineContext'

export const PivotTableEmptyRow = ({ height, columns }) => {
    const engine = usePivotTableEngine()

    return (
        <tr>
            <PivotTableCell
                isHeader={true}
                colSpan={engine.rowDepth}
                style={{ height }}
                classes={[
                    'row-header',
                    {
                        'fixed-header': engine.options.fixRowHeaders,
                    },
                ]}
            />
            {columns.map(i => (
                <PivotTableCell key={i} />
            ))}
        </tr>
    )
}

PivotTableEmptyRow.propTypes = {
    columns: PropTypes.array.isRequired,
    height: PropTypes.number.isRequired,
}
