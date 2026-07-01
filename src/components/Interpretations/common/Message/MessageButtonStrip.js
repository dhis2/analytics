import { spacers } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const MessageButtonStrip = ({ children }) => (
    <div className="container">
        {children}
        <style jsx>{`
            .container {
                display: flex;
                flex-wrap: wrap-reverse;
                gap: ${spacers.dp4};
                margin-block-start: ${spacers.dp4};
            }
        `}</style>
    </div>
)

MessageButtonStrip.propTypes = {
    children: PropTypes.node.isRequired,
}

export { MessageButtonStrip }
