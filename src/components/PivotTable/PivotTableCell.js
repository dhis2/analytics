import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { cell as cellStyle } from './styles/PivotTable.style'
import { usePivotTableEngine } from './PivotTableEngineContext'

export const PivotTableCell = ({
    classes,
    isColumnHeader,
    children,
    style = {},
    ...props
}) => {
    const engine = usePivotTableEngine()
    style.height = style.minHeight = style.maxHeight =
        style.height || engine.fontSize + engine.cellPadding * 2 + 2

    const className = classnames(
        classes,
        `fontsize-${engine.visualization.fontSize}`,
        `displaydensity-${engine.visualization.displayDensity}`
    )

    return isColumnHeader ? (
        <th className={className} style={style} {...props}>
            <style jsx>{cellStyle}</style>
            {children}
        </th>
    ) : (
        <td className={className} style={style} {...props}>
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
    style: PropTypes.object,
}
