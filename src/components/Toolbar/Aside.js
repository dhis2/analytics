import PropTypes from 'prop-types'
import React from 'react'

export const Aside = ({ children }) => (
    <div>
        {children}
        <style jsx>{`
            div {
                flex-grow: 0;
                display: flex;
                align-items: stretch;
            }
        `}</style>
    </div>
)

Aside.propTypes = {
    children: PropTypes.node,
}
