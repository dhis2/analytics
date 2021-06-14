import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { PivotTableCell } from './PivotTableCell'
import { usePivotTableEngine } from './PivotTableEngineContext'
import { cell as cellStyle } from './styles/PivotTable.style'

export const PivotTableTitleRow = ({
    title,
    scrollPosition,
    containerWidth,
    totalWidth,
}) => {
    const engine = usePivotTableEngine()
    const columnCount = engine.width + engine.rowDepth

    const [position, setPosition] = useState(scrollPosition.x)
    useEffect(() => {
        setPosition(
            Math.max(0, Math.min(scrollPosition.x, totalWidth - containerWidth))
        )
    }, [containerWidth, scrollPosition.x, totalWidth])
    return (
        <tr>
            <style jsx>{cellStyle}</style>
            <PivotTableCell
                classes={['column-header', 'title']}
                colSpan={columnCount}
            >
                <div
                    style={{
                        marginLeft: position,
                        maxWidth: containerWidth,
                        textAlign: 'center',
                    }}
                    data-test="visualization-title"
                >
                    {title}
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
