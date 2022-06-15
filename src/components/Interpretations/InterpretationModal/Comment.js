import i18n from '@dhis2/d2-i18n'
import { IconEdit16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Message, MessageIconButton, MessageStatsBar } from '../common/index.js'
import { CommentDeleteButton } from './CommentDeleteButton.js'
import { CommentUpdateForm } from './CommentUpdateForm.js'

const Comment = ({
    comment,
    currentUser,
    interpretationId,
    onThreadUpdated,
}) => {
    const [isUpdateMode, setIsUpdateMode] = useState(false)

    return isUpdateMode ? (
        <CommentUpdateForm
            close={() => setIsUpdateMode(false)}
            commentId={comment.id}
            interpretationId={interpretationId}
            onComplete={() => onThreadUpdated(false)}
            text={comment.text}
            currentUser={currentUser}
        />
    ) : (
        <Message
            text={comment.text}
            created={comment.created}
            username={comment.createdBy.displayName}
        >
            <MessageStatsBar>
                {comment.access.update && (
                    <MessageIconButton
                        iconComponent={IconEdit16}
                        tooltipContent={i18n.t('Edit')}
                        onClick={() => setIsUpdateMode(true)}
                    />
                )}
                {comment.access.delete && (
                    <CommentDeleteButton
                        commentId={comment.id}
                        interpretationId={interpretationId}
                        onComplete={() => onThreadUpdated(true)}
                    />
                )}
            </MessageStatsBar>
        </Message>
    )
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    interpretationId: PropTypes.string.isRequired,
    onThreadUpdated: PropTypes.func.isRequired,
}

export { Comment }
