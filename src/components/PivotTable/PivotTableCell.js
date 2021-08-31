import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { usePivotTableEngine } from './PivotTableEngineContext'
import { cell as cellStyle } from './styles/PivotTable.style'

export const PivotTableCell = React.forwardRef(
    (
        { classes, isColumnHeader, children, dataTest, style = {}, ...props },
        ref
    ) => {
        const engine = usePivotTableEngine()
        style.width =
            style.minWidth =
            style.maxWidth =
            style.width
        
        style.height =
            style.minHeight =
            style.maxHeight =
                style.height || engine.fontSize + engine.cellPadding * 2 + 2

        const className = classnames(
            classes,
            `fontsize-${engine.visualization.fontSize}`,
            `displaydensity-${engine.visualization.displayDensity}`
        )

        return isColumnHeader ? (
            <th
                className={className}
                style={style}
                data-test={dataTest}
                {...props}
            >
                <style jsx>{cellStyle}</style>
                {children}
            </th>
        ) : (
            <td
                ref={ref}
                className={className}
                style={style}
                data-test={dataTest}
                {...props}
            >
                <style jsx>{cellStyle}</style>
                {children}
            </td>
        )
    }
)

PivotTableCell.displayName = 'PivotTableCell'

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
    dataTest: PropTypes.string,
    isColumnHeader: PropTypes.bool,
    style: PropTypes.object,
}
