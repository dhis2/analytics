import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { RichTextEditor } from '../../RichText/index.js'
import {
    MessageEditorContainer,
    MessageButtonStrip,
    MessageInput,
} from '../common/index.js'
import {
    useAddCommentToActiveInterpretation,
    useInterpretationsCurrentUser,
} from '../InterpretationsProvider/hooks.js'

export const CommentAddForm = ({ focusRef }) => {
    const currentUser = useInterpretationsCurrentUser()
    const [showRichTextEditor, setShowRichTextEditor] = useState(false)
    const [text, setText] = useState('')
    const closeForm = useCallback(() => {
        setShowRichTextEditor(false)
        setText('')
    }, [])
    const [save, { loading, error }] = useAddCommentToActiveInterpretation({
        text,
        onComplete: closeForm,
    })

    const inputPlaceholder = i18n.t('Write a reply')

    return (
        <MessageEditorContainer currentUserName={currentUser.name}>
            {showRichTextEditor ? (
                <>
                    <RichTextEditor
                        inputPlaceholder={inputPlaceholder}
                        onChange={setText}
                        value={text}
                        ref={focusRef}
                        disabled={loading}
                        errorText={error ? i18n.t('Could not post reply') : ''}
                    />
                    <MessageButtonStrip>
                        <Button primary small onClick={save} loading={loading}>
                            {i18n.t('Post reply')}
                        </Button>
                        <Button
                            secondary
                            small
                            disabled={loading}
                            onClick={closeForm}
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
    focusRef: PropTypes.object.isRequired,
}
