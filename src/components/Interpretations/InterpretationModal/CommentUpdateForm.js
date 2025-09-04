import i18n from '@dhis2/d2-i18n'
import { Button, spacers, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { RichTextEditor } from '../../RichText/index.js'
import { MessageEditorContainer, MessageButtonStrip } from '../common/index.js'
import {
    useInterpretationsCurrentUser,
    useUpdateCommentForActiveInterpretation,
} from '../InterpretationsProvider/hooks.js'

export const CommentUpdateForm = ({ id, text, onComplete }) => {
    const currentUser = useInterpretationsCurrentUser()
    const [commentText, setCommentText] = useState(text || '')
    const [update, { loading, error }] =
        useUpdateCommentForActiveInterpretation({
            id,
            text: commentText,
            onComplete,
        })
    const errorText = error ? i18n.t('Could not update comment') : ''

    return (
        <div className="message">
            <MessageEditorContainer currentUserName={currentUser.name}>
                <RichTextEditor
                    inputPlaceholder={i18n.t('Enter comment text')}
                    onChange={setCommentText}
                    value={commentText}
                    disabled={loading}
                    errorText={errorText}
                />
                <MessageButtonStrip>
                    <Button loading={loading} primary small onClick={update}>
                        {i18n.t('Update')}
                    </Button>
                    <Button
                        disabled={loading}
                        secondary
                        small
                        onClick={onComplete}
                    >
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
    id: PropTypes.string.isRequired,
    onComplete: PropTypes.func.isRequired,
    text: PropTypes.string,
}
