import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, spacers, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import {
    MessageEditorContainer,
    RichTextEditor,
    MessageButtonStrip,
} from '../common/index.js'

export const CommentUpdateForm = ({
    interpretationId,
    commentId,
    currentUser,
    text,
    close,
    onComplete,
}) => {
    const [commentText, setCommentText] = useState(text || '')
    const updateMutationRef = useRef({
        resource: `interpretations/${interpretationId}/comments/${commentId}`,
        type: 'update',
        partial: false,
        data: ({ commentText }) => commentText,
    })
    const [update, { loading, error }] = useDataMutation(
        updateMutationRef.current,
        {
            onComplete: () => {
                onComplete()
                close()
            },
        }
    )
    const errorText = error
        ? error.message || i18n.t('Could not update comment')
        : ''

    return (
        <div className="message">
            <MessageEditorContainer currentUser={currentUser}>
                <RichTextEditor
                    inputPlaceholder={i18n.t('Enter comment text')}
                    onChange={setCommentText}
                    value={commentText}
                    disabled={loading}
                    errorText={errorText}
                />
                <MessageButtonStrip>
                    <Button
                        loading={loading}
                        primary
                        small
                        onClick={() => update({ commentText })}
                    >
                        {i18n.t('Update')}
                    </Button>
                    <Button disabled={loading} secondary small onClick={close}>
                        {i18n.t('Cancel')}
                    </Button>
                </MessageButtonStrip>
            </MessageEditorContainer>
            <style jsx>{`
                .message {
                    padding: 0 ${spacers.dp8} ${spacers.dp8};
                    background-color: ${colors.grey100};
                    border-radius: 5px;
                }
            `}</style>
        </div>
    )
}
CommentUpdateForm.propTypes = {
    close: PropTypes.func.isRequired,
    commentId: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired,
    interpretationId: PropTypes.string.isRequired,
    onComplete: PropTypes.func.isRequired,
    text: PropTypes.string,
}
