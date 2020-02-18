import React from 'react'
import PropTypes from 'prop-types'
import { cell as cellStyle } from './styles/PivotTable.style'
import { renderValue } from '../../modules/pivotTable/renderValue'
import { applyLegendSet } from '../../modules/pivotTable/applyLegendSet'

export const PivotTableValueCell = ({ engine, row, column }) => {
    const rawValue = engine.get({
        row,
        column,
    })

    const value = renderValue(rawValue, engine.visualization)
    const type = engine.getCellType({
        row,
        column,
    })

    const style =
        type === 'value'
            ? applyLegendSet(parseFloat(rawValue), engine)
            : undefined

    return (
        <td key={column} className={type} title={value} style={style}>
            <style jsx>{cellStyle}</style>
            {value || null}
        </td>
    )
}

PivotTableValueCell.propTypes = {
    column: PropTypes.number.isRequired,
    engine: PropTypes.object.isRequired,
    row: PropTypes.number.isRequired,
}
