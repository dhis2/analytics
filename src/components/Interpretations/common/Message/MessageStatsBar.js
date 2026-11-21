import { spacers } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const MessageStatsBar = ({ children }) => (
    <div className="container">
        {children}
        <style jsx>{`
            .container {
                display: flex;
                align-items: flex-start;
                gap: ${spacers.dp4};
            }
        `}</style>
    </div>
)

MessageStatsBar.propTypes = {
    children: PropTypes.node.isRequired,
}

export { MessageStatsBar }
