import { Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useMemo } from 'react'
import { PivotTableCell } from './PivotTableCell.js'
import { usePivotTableEngine } from './PivotTableEngineContext.js'
import { cell as cellStyle } from './styles/PivotTable.style.js'

export const PivotTableTitleRow = ({
    title,
    scrollPosition,
    containerWidth,
    totalWidth,
}) => {
    const containerRef = useRef(null)
    const engine = usePivotTableEngine()
    const columnCount = engine.width + engine.rowDepth
    const maxWidth = useMemo(
        () => containerWidth - (engine.cellPadding * 2 + 2),
        [containerWidth, engine.cellPadding]
    )
    const marginLeft = useMemo(
        () =>
            Math.max(
                0,
                Math.min(scrollPosition?.x ?? 0, totalWidth - containerWidth)
            ),
        [containerWidth, scrollPosition.x, totalWidth]
    )
    const titleIsTruncated =
        containerRef.current?.scrollWidth > containerRef.current?.clientWidth

    return (
        <tr>
            <style jsx>{cellStyle}</style>
            <PivotTableCell
                isHeader
                classes={['column-header', 'title-cell']}
                colSpan={columnCount}
            >
                <div
                    style={{ marginLeft, maxWidth }}
                    ref={containerRef}
                    data-test="visualization-title"
                    className="title-cell-content"
                >
                    {titleIsTruncated ? (
                        <Tooltip content={title}>
                            {({ ref: tooltipRef, onMouseOver, onMouseOut }) => (
                                <div
                                    ref={tooltipRef}
                                    onMouseOver={onMouseOver}
                                    onMouseOut={onMouseOut}
                                    className="title-cell-content"
                                    style={{ maxWidth }}
                                >
                                    {title}
                                </div>
                            )}
                        </Tooltip>
                    ) : (
                        title
                    )}
                </div>
            </PivotTableCell>
        </tr>
    )
}

PivotTableTitleRow.propTypes = {
    containerWidth: PropTypes.number.isRequired,
    scrollPosition: PropTypes.shape({ x: PropTypes.number.isRequired })
        .isRequired,
    title: PropTypes.string.isRequired,
    totalWidth: PropTypes.number.isRequired,
}
