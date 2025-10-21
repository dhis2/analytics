import { UserAvatar, spacers } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const MessageEditorContainer = ({ children, currentUserName, dataTest }) => (
    <div className="container" data-test={dataTest}>
        <div className="avatar">
            <UserAvatar name={currentUserName} medium />
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
                height: 100%;
            }
        `}</style>
    </div>
)

MessageEditorContainer.propTypes = {
    currentUserName: PropTypes.string.isRequired,
    children: PropTypes.node,
    dataTest: PropTypes.string,
}

export { MessageEditorContainer }
