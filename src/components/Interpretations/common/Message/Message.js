import { Parser as RichTextParser } from '@dhis2/d2-ui-rich-text'
import { UserAvatar, spacers, colors } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

const Message = ({ children, text, created, username }) => (
    <li className="container">
        <div className="header">
            <UserAvatar name={username} extrasmall />
            {username}
            <time dateTime={created}>{moment(created).format('lll')}</time>
        </div>
        <div className="content">
            <RichTextParser>{text}</RichTextParser>
        </div>
        <div className="footer">{children}</div>
        <style jsx>{`
            .container {
                padding: ${spacers.dp8};
                background-color: ${colors.grey100};
                border-radius: 5px;
                display: flex;
                flex-direction: column;
                gap: ${spacers.dp8};
            }

            .header {
                display: flex;
                gap: 6px;
                align-items: center;
                font-size: 13px;
                line-height: 16px;
                color: ${colors.grey900};
            }

            .header time {
                font-size: 12px;
                color: ${colors.grey600};
            }

            .content {
                font-size: 14px;
                line-height: 19px;
                color: ${colors.grey900};
            }

            .content :global(p:first-child) {
                margin: 0;
            }

            .footer {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: ${spacers.dp8};
            }
        `}</style>
    </li>
)

Message.propTypes = {
    children: PropTypes.node.isRequired,
    created: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
}

export { Message }
