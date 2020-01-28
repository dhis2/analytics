import React, { useRef, useMemo, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import styles from './styles/PivotTable.style'
import { PivotTableEngine } from '../../modules/pivotTable/PivotTableEngine'
import { clipAxis } from '../../modules/pivotTable/clipAxis'
import { getHeaderForDisplay } from '../../modules/pivotTable/getHeaderForDisplay'
import { useScrollPosition } from '../../modules/pivotTable/useScrollPosition'

const PivotTable = ({ visualization, data, options }) => {
    const container = useRef(undefined)
    const scrollPosition = useScrollPosition(container)
    const [{ width, height }, setSize] = useState({ width: 0, height: 0 })

    const lookup = useMemo(
        () => new PivotTableEngine(visualization, data, options),
        [visualization, data, options]
    )

    const clippedRows = useMemo(
        () =>
            clipAxis({
                position: scrollPosition.y,
                size: height,
                step: 25,
                totalCount: lookup.height,
                headerCount: visualization.columns.length,
            }),
        [height, lookup.height, scrollPosition.y, visualization.columns.length]
    )
    const clippedCols = useMemo(
        () =>
            clipAxis({
                position: scrollPosition.x,
                size: width,
                step: 150,
                totalCount: lookup.width,
                headerCount: visualization.rows.length,
            }),
        [width, lookup.width, scrollPosition.x, visualization.rows.length]
    )

    useEffect(() => {
        const el = container.current && container.current.parentElement
        if (!el) return

        const onResize = () => {
            setSize({
                width: el.clientWidth,
                height: el.clientHeight,
            })
        }
        onResize(el)

        const observer = new ResizeObserver(onResize)
        observer.observe(el)

        return () => observer.disconnect()
    }, [container])

    return (
        <div className="pivot-table-container" ref={container}>
            <style jsx>{styles}</style>
            {width === 0 || height === 0 ? null : (
                <table>
                    <thead>
                        {lookup.dimensionLookup.columns.map(
                            (_, columnLevel) => (
                                <tr key={columnLevel}>
                                    <th
                                        colSpan={lookup.rowDepth}
                                        className="empty-header row-header"
                                    ></th>
                                    {clippedCols.pre ? (
                                        <th
                                            className="col-header"
                                            style={{
                                                minWidth: clippedCols.pre,
                                            }}
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
                                            style={{
                                                minWidth: clippedCols.post,
                                            }}
                                        />
                                    ) : null}
                                </tr>
                            )
                        )}
                    </thead>
                    <tbody>
                        {clippedRows.pre ? (
                            <tr>
                                <td style={{ height: clippedRows.pre }} />
                            </tr>
                        ) : null}

                        {clippedRows.indices.map(index => (
                            <tr key={index}>
                                {lookup.dimensionLookup.rows.map(
                                    (_, rowLevel) => {
                                        const header = getHeaderForDisplay({
                                            start: clippedRows.indices[0],
                                            count: clippedRows.indices.length,
                                            index,
                                            dimensionLevel: rowLevel,
                                            getHeader: idx =>
                                                lookup.getRowHeader(idx),
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
                                    }
                                )}
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
            )}
        </div>
    )
}

PivotTable.propTypes = {
    data: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    visualization: PropTypes.object.isRequired,
}

export default PivotTable
