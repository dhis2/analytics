import { Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState, useEffect } from 'react'
import { PivotTableCell } from './PivotTableCell.jsx'
import { usePivotTableEngine } from './PivotTableEngineContext.jsx'
import { cell as cellStyle } from './styles/PivotTable.style.js'

export const PivotTableTitleRow = ({
    title,
    scrollPosition,
    containerWidth,
}) => {
    const containerRef = useRef(null)
    const [scrollWidth, setScrollWidth] = useState(0)
    const [isTitleTruncated, setIsTitleTruncated] = useState(false)
    const engine = usePivotTableEngine()
    const columnCount = engine.width + engine.rowDepth
    const maxWidth = containerWidth - (engine.cellPadding * 2 + 2)
    const marginLeft = Math.max(0, scrollPosition?.x ?? 0)

    useEffect(() => {
        if (containerRef.current) {
            /* Only set `scrollWidth` once, because during a CSS transition
             * the reported value can sometimes be equal to `clientWidth`
             * even though the text doesn't fit. Due to `white-space: nowrap`
             * and `overflow: hidden` the `scrollWidth` should remain constant,
             * so we can assume this initial value is correct. */
            if (!scrollWidth) {
                setScrollWidth(containerRef.current.scrollWidth)
            }
            const currentScrollWidth =
                scrollWidth ?? containerRef.current.scrollWidth
            const newIsTitleTruncated =
                currentScrollWidth > containerRef.current.clientWidth
            if (newIsTitleTruncated !== isTitleTruncated) {
                setIsTitleTruncated(newIsTitleTruncated)
            }
        }
    }, [containerWidth, scrollWidth, isTitleTruncated])

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
                    {isTitleTruncated ? (
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
}
