import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { cell as cellStyle } from './styles/PivotTable.style'

const getDimensionLabel = (engine, rowLevel, columnLevel) => {
    const lastRowLevel = engine.dimensionLookup.rows.length - 1
    const lastColumnLevel = engine.dimensionLookup.columns.length - 1
    if (rowLevel !== lastRowLevel && columnLevel !== lastColumnLevel) {
        return null
    }
    if (rowLevel === lastRowLevel && columnLevel === lastColumnLevel) {
        return `${engine.dimensionLookup.rows[lastRowLevel].meta.name} / ${engine.dimensionLookup.columns[lastColumnLevel].meta.name}`
    }

    if (rowLevel === lastRowLevel) {
        return engine.dimensionLookup.columns[columnLevel].meta.name
    }
    if (columnLevel === lastColumnLevel) {
        return engine.dimensionLookup.rows[rowLevel].meta.name
    }
}

export const PivotTableDimensionLabelCell = ({
    engine,
    rowLevel,
    columnLevel,
}) => {
    const colCount = engine.dimensionLookup.rows.length
    const rowCount = engine.dimensionLookup.columns.length
    if (!engine.visualization.showDimensionLabels) {
        if (rowLevel === 0 && columnLevel === 0) {
            return (
                <td
                    className={classnames(
                        'empty-header',
                        'column-header',
                        `fontsize-${engine.visualization.fontSize}`,
                        `displaydensity-${engine.visualization.displayDensity}`
                    )}
                    colSpan={colCount}
                    rowSpan={rowCount}
                >
                    <style jsx>{cellStyle}</style>
                </td>
            )
        }
        return null
    }

    const dimensionLabel = getDimensionLabel(engine, rowLevel, columnLevel)
    if (!dimensionLabel) {
        if (rowLevel === 0 && columnLevel === 0) {
            return (
                <td
                    className={classnames(
                        'empty-header',
                        'column-header',
                        `fontsize-${engine.visualization.fontSize}`,
                        `displaydensity-${engine.visualization.displayDensity}`
                    )}
                    colSpan={colCount - 1}
                    rowSpan={rowCount - 1}
                >
                    <style jsx>{cellStyle}</style>
                </td>
            )
        }
        return null
    }
    return (
        <th
            className={classnames(
                'empty-header',
                'column-header',
                `fontsize-${engine.visualization.fontSize}`,
                `displaydensity-${engine.visualization.displayDensity}`
            )}
            title={dimensionLabel}
        >
            <style jsx>{cellStyle}</style>
            {dimensionLabel}
        </th>
    )
}

PivotTableDimensionLabelCell.propTypes = {
    columnLevel: PropTypes.number.isRequired,
    engine: PropTypes.object.isRequired,
    rowLevel: PropTypes.number.isRequired,
}
