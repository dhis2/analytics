import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { cell as cellStyle } from './styles/PivotTable.style'
import { renderValue } from '../../modules/pivotTable/renderValue'
import { applyLegendSet } from '../../modules/pivotTable/applyLegendSet'

export const PivotTableValueCell = ({ engine, row, column }) => {
    const rawValue = engine.get({
        row,
        column,
    })

    const dxDimension = engine.getCellDxDimension({ row, column })

    const value = renderValue(
        rawValue,
        dxDimension.valueType,
        engine.visualization
    )
    const type = engine.getCellType({
        row,
        column,
    })

    // TODO: Add support for 'INTEGER' type (requires server changes)
    const style =
        type === 'value' && dxDimension.valueType === 'NUMBER'
            ? applyLegendSet(parseFloat(rawValue), dxDimension, engine)
            : undefined

    return (
        <td
            key={column}
            className={classnames(
                type,
                dxDimension.valueType,
                `fontsize-${engine.visualization.fontSize}`,
                `displaydensity-${engine.visualization.displayDensity}`
            )}
            title={value}
            style={style}
        >
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
