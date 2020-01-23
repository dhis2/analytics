import React, { useRef, useMemo } from 'react'
import PropTypes from 'prop-types'

import styles from './styles/PivotTable.style'
import { PivotTableEngine } from '../../modules/pivotTable/PivotTableEngine'
import { clipAxis } from '../../modules/pivotTable/clipAxis'
import { getHeaderForDisplay } from '../../modules/pivotTable/getHeaderForDisplay'
import { useScrollPosition } from '../../modules/pivotTable/useScrollPosition'

export const PivotTable = ({ visualization, data, options }) => {
    const container = useRef(undefined)
    const scrollPosition = useScrollPosition(container)

    const lookup = useMemo(
        () => new PivotTableEngine(visualization, data, options),
        [visualization, data, options]
    )

    const clippedRows = clipAxis(
        scrollPosition.y,
        600,
        25,
        lookup.height,
        visualization.columns.length
    )
    const clippedCols = clipAxis(
        scrollPosition.x,
        1200,
        150,
        lookup.width,
        visualization.rows.length
    )

    return (
        <div className="pivot-table-container" ref={container}>
            <style jsx>{styles}</style>
            <table>
                <thead>
                    {lookup.dimensionLookup.columns.map((_, columnLevel) => (
                        <tr key={columnLevel}>
                            <th
                                colSpan={lookup.rowDepth}
                                className="empty-header row-header"
                            ></th>
                            {clippedCols.pre ? (
                                <th
                                    className="col-header"
                                    style={{ minWidth: clippedCols.pre }}
                                />
                            ) : null}
                            {clippedCols.indices.map(index => {
                                const header = getHeaderForDisplay({
                                    start: clippedCols.indices[0],
                                    count: clippedCols.indices.length,
                                    index,
                                    dimensionLevel: columnLevel,
                                    getHeader: idx =>
                                        lookup.getColumnHeader(idx),
                                })
                                return !header ? null : (
                                    <th
                                        key={index}
                                        className={
                                            header.name &&
                                            header.name !== 'TOTAL'
                                                ? 'col-header'
                                                : 'empty-header'
                                        }
                                        colSpan={header.span}
                                    >
                                        {header.name}
                                    </th>
                                )
                            })}
                            {clippedCols.post ? (
                                <th
                                    className="col-header"
                                    style={{ minWidth: clippedCols.post }}
                                />
                            ) : null}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {clippedRows.pre ? (
                        <tr>
                            <td style={{ height: clippedRows.pre }} />
                        </tr>
                    ) : null}

                    {clippedRows.indices.map(index => (
                        <tr key={index}>
                            {lookup.dimensionLookup.rows.map((_, rowLevel) => {
                                const header = getHeaderForDisplay({
                                    start: clippedRows.indices[0],
                                    count: clippedRows.indices.length,
                                    index,
                                    dimensionLevel: rowLevel,
                                    getHeader: idx => lookup.getRowHeader(idx),
                                })
                                return !header ? null : (
                                    <td
                                        key={rowLevel}
                                        className={
                                            header.name &&
                                            header.name !== 'TOTAL'
                                                ? 'row-header'
                                                : 'empty-header'
                                        }
                                        rowSpan={header.span}
                                    >
                                        {header.name}
                                    </td>
                                )
                            })}
                            {clippedCols.pre ? <td /> : null}
                            {clippedCols.indices.map(col => {
                                const value = lookup.get({
                                    row: index,
                                    column: col,
                                    field: 'value',
                                })
                                const type = lookup.getCellType({
                                    row: index,
                                    column: col,
                                })
                                return (
                                    <td key={col} className={type}>
                                        {value || null}
                                    </td>
                                )
                            })}
                            {clippedCols.post ? <td /> : null}
                        </tr>
                    ))}

                    {clippedRows.post ? (
                        <tr>
                            <td style={{ height: clippedRows.post }} />
                        </tr>
                    ) : null}
                </tbody>
            </table>
        </div>
    )
}

PivotTable.propTypes = {
    data: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    visualization: PropTypes.object.isRequired,
}
