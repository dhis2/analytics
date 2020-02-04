import React from 'react'
import PropTypes from 'prop-types'

import { cell as cellStyle } from './styles/PivotTable.style'

export const PivotTableEmptyRow = ({ height, engine, columns }) => (
    <tr>
        <style jsx>{cellStyle}</style>
        <td
            colSpan={engine.dimensionLookup.rows.length}
            style={{ height }}
            className="row-header"
        />
        {columns.map(i => (
            <td key={i} />
        ))}
    </tr>
)

PivotTableEmptyRow.propTypes = {
    columns: PropTypes.array.isRequired,
    engine: PropTypes.object.isRequired,
    height: PropTypes.number.isRequired,
}
