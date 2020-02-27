import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { cell as cellStyle } from './styles/PivotTable.style'
import { usePivotTableEngine } from './PivotTableEngineContext'
import { CLIPPING_TABLE_MIN_SIZE } from '../../modules/pivotTable/pivotTableConstants'

export const PivotTableCell = ({
    classes,
    isColumnHeader,
    children,
    ...props
}) => {
    const engine = usePivotTableEngine()

    const className = classnames(
        classes,
        engine.size >= CLIPPING_TABLE_MIN_SIZE && 'clipped',
        `fontsize-${engine.visualization.fontSize}`,
        `displaydensity-${engine.visualization.displayDensity}`
    )

    return isColumnHeader ? (
        <th className={className} {...props}>
            <style jsx>{cellStyle}</style>
            {children}
        </th>
    ) : (
        <td className={className} {...props}>
            <style jsx>{cellStyle}</style>
            {children}
        </td>
    )
}

PivotTableCell.defaultProps = {
    isColumnHeader: false,
}
PivotTableCell.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
        PropTypes.string,
    ]),
    isColumnHeader: PropTypes.bool,
}
