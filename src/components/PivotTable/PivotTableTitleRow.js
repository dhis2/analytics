import React from 'react'
import PropTypes from 'prop-types'
import { cell as cellStyle } from './styles/PivotTable.style'
import { usePivotTableEngine } from './PivotTableEngineContext'
import { PivotTableCell } from './PivotTableCell'

export const PivotTableTitleRow = ({
    title,
    scrollPosition,
    containerWidth,
}) => {
    const engine = usePivotTableEngine()
    const columnCount = engine.width + engine.dimensionLookup.rows.length
    return (
        <tr>
            <style jsx>{cellStyle}</style>
            <PivotTableCell
                classes={['column-header', 'title']}
                colSpan={columnCount}
            >
                <div
                    style={{
                        marginLeft: Math.floor(scrollPosition.x / 150) * 150,
                        width:
                            Math.min(
                                columnCount,
                                Math.ceil(containerWidth / 150) + 1
                            ) * 150,
                        textAlign: 'center',
                    }}
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
}
