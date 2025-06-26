import { colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

export const Toolbar = ({ children, dataTest = 'dhis2-analytics-toolbar' }) => (
    <div data-test={dataTest}>
        {children}
        <style jsx>{`
            div {
                box-sizing: border-box;
                min-height: 32px;
                max-height: 32px;
                display: flex;
                align-items: stretch;
                border-bottom: 1px solid ${colors.grey400};
                background-color: ${colors.white};
            }
        `}</style>
    </div>
)

Toolbar.propTypes = {
    children: PropTypes.node,
    dataTest: PropTypes.string,
}
