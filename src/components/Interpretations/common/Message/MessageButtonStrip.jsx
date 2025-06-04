import { spacers } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const MessageButtonStrip = ({ children }) => (
    <div className="container">
        {children}
        <style jsx>{`
            .container {
                display: flex;
                gap: ${spacers.dp8};
                margin-top: ${spacers.dp8};
            }
        `}</style>
    </div>
)

MessageButtonStrip.propTypes = {
    children: PropTypes.node.isRequired,
}

export { MessageButtonStrip }
