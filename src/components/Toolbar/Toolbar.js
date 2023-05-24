import { colors } from '@dhis2/ui-constants'
import PropTypes from 'prop-types'
import React from 'react'

export const Toolbar = ({ children }) => (
    <div>
        {children}
        <style jsx>{`
            div {
                min-height: 32px;
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
}
