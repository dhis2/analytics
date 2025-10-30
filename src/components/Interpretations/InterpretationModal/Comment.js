import i18n from '@dhis2/d2-i18n'
import { IconEdit16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { Message, MessageIconButton, MessageStatsBar } from '../common/index.js'
import { useCommentAccess } from '../InterpretationsProvider/hooks.js'
import { CommentDeleteButton } from './CommentDeleteButton.js'
import { CommentUpdateForm } from './CommentUpdateForm.js'

const Comment = ({ comment, canComment }) => {
    const [isUpdateMode, setIsUpdateMode] = useState(false)
    const [commentText, setCommentText] = useState(comment.text)
    const onUpdateComplete = useCallback((newText) => {
        setCommentText(newText)
        setIsUpdateMode(false)
    }, [])
    const onUpdateCancel = useCallback(() => {
        setIsUpdateMode(false)
    }, [])
    const commentAccess = useCommentAccess(comment, canComment)

    return isUpdateMode ? (
        <CommentUpdateForm
            onComplete={onUpdateComplete}
            onCancel={onUpdateCancel}
            id={comment.id}
            text={comment.text}
        />
    ) : (
        <Message
            text={commentText}
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
                        <CommentDeleteButton id={comment.id} />
                    )}
                </MessageStatsBar>
            )}
        </Message>
    )
}

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    canComment: PropTypes.bool,
}

export { Comment }
