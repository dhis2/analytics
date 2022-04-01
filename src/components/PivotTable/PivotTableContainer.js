import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { usePivotTableEngine } from './PivotTableEngineContext.js'
import { table as tableStyle } from './styles/PivotTable.style.js'

export const PivotTableContainer = React.forwardRef(
    ({ width, height, children }, ref) => {
        const engine = usePivotTableEngine()

        return (
            <div
                className="pivot-table-container"
                style={{ width, height }}
                ref={ref}
                data-test="visualization-container"
            >
                <style jsx>{tableStyle}</style>
                {width === 0 || height === 0 ? null : (
                    <table
                        className={classnames({
                            'fixed-headers':
                                engine.options.fixColumnHeaders &&
                                engine.options.fixRowHeaders,
                            'fixed-column-headers':
                                engine.options.fixColumnHeaders &&
                                !engine.options.fixRowHeaders,
                            'fixed-row-headers':
                                engine.options.fixRowHeaders &&
                                !engine.options.fixColumnHeaders,
                        })}
                    >
                        {children}
                    </table>
                )}
            </div>
        )
    }
)

PivotTableContainer.displayName = 'PivotTableContainer'

PivotTableContainer.propTypes = {
    children: PropTypes.node.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
}
