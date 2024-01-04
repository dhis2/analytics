import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
    RichTextEditor,
    MessageEditorContainer,
    MessageButtonStrip,
    MessageInput,
} from '../common/index.js'

export const CommentAddForm = ({ currentUser, focusRef, fetching, save }) => {
    const [showRichTextEditor, setShowRichTextEditor] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [saveTriggered, setSaveTriggered] = useState(false)

    const clearForm = () => {
        setSaveTriggered(false)
        setCommentText('')
        setShowRichTextEditor(false)
    }

    useEffect(() => {
        if (saveTriggered && !fetching) {
            clearForm()
        }
    }, [saveTriggered, fetching])

    const saveComment = () => {
        setSaveTriggered(true)
        save({ commentText })
    }

    const inputPlaceholder = i18n.t('Write a reply')

    return (
        <MessageEditorContainer currentUser={currentUser}>
            {showRichTextEditor ? (
                <>
                    <RichTextEditor
                        inputPlaceholder={inputPlaceholder}
                        onChange={setCommentText}
                        value={commentText}
                        ref={focusRef}
                        disabled={fetching}
                    />
                    <MessageButtonStrip>
                        <Button
                            primary
                            small
                            onClick={saveComment}
                            loading={fetching}
                        >
                            {i18n.t('Post reply')}
                        </Button>
                        <Button
                            secondary
                            small
                            disabled={fetching}
                            onClick={clearForm}
                        >
                            {i18n.t('Cancel')}
                        </Button>
                    </MessageButtonStrip>
                </>
            ) : (
                <MessageInput
                    onFocus={() => setShowRichTextEditor(true)}
                    placeholder={inputPlaceholder}
                    ref={focusRef}
                />
            )}
        </MessageEditorContainer>
    )
}

CommentAddForm.propTypes = {
    currentUser: PropTypes.object.isRequired,
    fetching: PropTypes.bool.isRequired,
    focusRef: PropTypes.object.isRequired,
    save: PropTypes.func.isRequired,
}
