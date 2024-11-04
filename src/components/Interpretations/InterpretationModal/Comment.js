import { IconEdit16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import i18n from '../../../locales/index.js'
import {
    Message,
    MessageIconButton,
    MessageStatsBar,
    getCommentAccess,
} from '../common/index.js'
import { CommentDeleteButton } from './CommentDeleteButton.js'
import { CommentUpdateForm } from './CommentUpdateForm.js'

const Comment = ({
    comment,
    currentUser,
    interpretationId,
    onThreadUpdated,
    canComment,
}) => {
    const [isUpdateMode, setIsUpdateMode] = useState(false)

    const commentAccess = getCommentAccess(comment, canComment, currentUser)

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
            {commentAccess.edit && (
                <MessageStatsBar>
                    <MessageIconButton
                        iconComponent={IconEdit16}
                        tooltipContent={i18n.t('Edit')}
                        onClick={() => setIsUpdateMode(true)}
                    />

                    {commentAccess.delete && (
                        <CommentDeleteButton
                            commentId={comment.id}
                            interpretationId={interpretationId}
                            onComplete={() => onThreadUpdated(true)}
                        />
                    )}
                </MessageStatsBar>
            )}
        </Message>
    )
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    interpretationId: PropTypes.string.isRequired,
    onThreadUpdated: PropTypes.func.isRequired,
    canComment: PropTypes.bool,
}

export { Comment }
