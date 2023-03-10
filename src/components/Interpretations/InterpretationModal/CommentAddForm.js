import { useDataMutation } from '@dhis2/app-runtime'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import i18n from '../../../locales/index.js'
import {
    RichTextEditor,
    MessageEditorContainer,
    MessageButtonStrip,
    MessageInput,
} from '../common/index.js'

export const CommentAddForm = ({
    interpretationId,
    currentUser,
    onSave,
    focusRef,
}) => {
    const [showRichTextEditor, setShowRichTextEditor] = useState(false)
    const [commentText, setCommentText] = useState('')

    const saveMutationRef = useRef({
        resource: `interpretations/${interpretationId}/comments`,
        type: 'create',
        data: ({ commentText }) => commentText,
    })

    const [save, { loading }] = useDataMutation(saveMutationRef.current, {
        onComplete: () => {
            setShowRichTextEditor(false)
            setCommentText('')
            onSave()
        },
    })

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
                        disabled={loading}
                    />
                    <MessageButtonStrip>
                        <Button
                            primary
                            small
                            onClick={() => save({ commentText })}
                            loading={loading}
                        >
                            {i18n.t('Post reply')}
                        </Button>
                        <Button
                            secondary
                            small
                            disabled={loading}
                            onClick={() => {
                                setCommentText('')
                                setShowRichTextEditor(false)
                            }}
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
    focusRef: PropTypes.object.isRequired,
    interpretationId: PropTypes.string.isRequired,
    onSave: PropTypes.func,
}
