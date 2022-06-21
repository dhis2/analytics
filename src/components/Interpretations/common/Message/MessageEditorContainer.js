import { UserAvatar, spacers } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const MessageEditorContainer = ({ children, currentUser }) => (
    <div className="container">
        <div className="avatar">
            <UserAvatar name={currentUser.name} medium />
        </div>
        <div className="editor">{children}</div>
        <style jsx>{`
            .container {
                display: flex;
                gap: ${spacers.dp8};
                margin-top: ${spacers.dp12};
            }
            .avatar {
                flex-grow: 0;
            }
            .editor {
                flex-grow: 1;
            }
        `}</style>
    </div>
)

MessageEditorContainer.propTypes = {
    currentUser: PropTypes.object.isRequired,
    children: PropTypes.node,
}

export { MessageEditorContainer }
