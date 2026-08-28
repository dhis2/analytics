import { useTimeZoneConversion } from '@dhis2/app-runtime'
import { spacers, colors, UserAvatar } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { RichTextParser } from '../../../RichText/index.js'

const Message = ({ children, text, created, username }) => {
    const { fromServerDate } = useTimeZoneConversion()
    return (
        <li className="container">
            <div className="avatar">
                <UserAvatar name={username} small />
            </div>
            <div className="main">
                <div className="header">
                    <span className="username">{username}</span>
                    <time dateTime={created}>
                        {moment(fromServerDate(created)).format(
                            'MMM D, YYYY [·] HH:mm'
                        )}
                    </time>
                </div>
                <div className="content">
                    <RichTextParser>{text}</RichTextParser>
                </div>
                <div className="footer">{children}</div>
            </div>
            <style jsx>{`
                .container {
                    display: flex;
                    flex-direction: row;
                    gap: ${spacers.dp8};
                    padding: 0;
                }

                .avatar {
                    flex-shrink: 0;
                    padding-top: 6px;
                }

                .main {
                    flex: 1;
                    min-width: 0;
                }

                .header {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    align-items: baseline;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 18px;
                    color: ${colors.grey900};
                    margin-block-end: ${spacers.dp8};
                }

                .header time {
                    font-size: 13px;
                    line-height: 16px;
                    font-weight: 400;
                    color: ${colors.grey600};
                }

                .content {
                    font-size: 14px;
                    line-height: 21px;
                    color: ${colors.grey900};
                    word-break: break-word;
                }

                .content :global(p) {
                    white-space: pre-line;
                }

                .content :global(p:first-child) {
                    margin: 0;
                }

                .footer {
                    display: flex;
                    flex-direction: row;
                    align-items: flex-start;
                    gap: ${spacers.dp4};
                    margin-block-start: ${spacers.dp4};
                }
            `}</style>
        </li>
    )
}

Message.propTypes = {
    children: PropTypes.node.isRequired,
    created: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
}

export { Message }
