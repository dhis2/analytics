import React from 'react'
import PropTypes from 'prop-types'
import { cell as cellStyle } from './styles/PivotTable.style'

export const PivotTableTitleRow = ({
    title,
    scrollPosition,
    containerWidth,
    engine,
}) => {
    const columnCount = engine.width + engine.dimensionLookup.rows.length
    return (
        <tr>
            <style jsx>{cellStyle}</style>
            <td className="column-header title" colSpan={columnCount}>
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
            </td>
        </tr>
    )
}

PivotTableTitleRow.propTypes = {
    containerWidth: PropTypes.number.isRequired,
    engine: PropTypes.object.isRequired,
    scrollPosition: PropTypes.shape({ x: PropTypes.number.isRequired })
        .isRequired,
    title: PropTypes.string.isRequired,
}
