import React from 'react'
import PropTypes from 'prop-types'
import { table as tableStyle } from './styles/PivotTable.style'

export const PivotTableContainer = React.forwardRef(
    ({ width, height, children }, ref) => (
        <div
            className="pivot-table-container"
            style={{ width, height }}
            ref={ref}
            data-test="visualization-container"
        >
            <style jsx>{tableStyle}</style>
            {width === 0 || height === 0 ? null : <table>{children}</table>}
        </div>
    )
)

PivotTableContainer.displayName = 'PivotTableContainer'

PivotTableContainer.propTypes = {
    children: PropTypes.node.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
}
