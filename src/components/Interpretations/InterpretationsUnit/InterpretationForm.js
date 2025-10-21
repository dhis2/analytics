import i18n from '@dhis2/d2-i18n'
import { Button, Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { RichTextEditor } from '../../RichText/index.js'
import { MessageEditorContainer, MessageButtonStrip } from '../common/index.js'
import {
    useCreateInterpretation,
    useInterpretationsCurrentUser,
} from '../InterpretationsProvider/hooks.js'

export const InterpretationForm = ({
    type,
    id,
    disabled,
    showNoTimeDimensionHelpText,
}) => {
    const [showRichTextEditor, setShowRichTextEditor] = useState(false)
    const [text, setText] = useState('')
    const onComplete = useCallback(() => {
        setShowRichTextEditor(false)
        setText('')
    }, [])
    const currentUser = useInterpretationsCurrentUser()
    const [save, { loading, error }] = useCreateInterpretation({
        type,
        id,
        text,
        onComplete,
    })
    const inputPlaceholder = i18n.t('Write an interpretation')

    return (
        <MessageEditorContainer
            currentUserName={currentUser.name}
            dataTest="interpretation-form"
        >
            {showRichTextEditor ? (
                <>
                    <RichTextEditor
                        disabled={loading}
                        inputPlaceholder={inputPlaceholder}
                        onChange={setText}
                        value={text}
                        errorText={
                            error ? i18n.t('Could not post interpretation') : ''
                        }
                        helpText={
                            showNoTimeDimensionHelpText
                                ? i18n.t(
                                      'Other people viewing this interpretation in the future may see more data.'
                                  )
                                : undefined
                        }
                    />
                    <MessageButtonStrip>
                        <Button
                            primary
                            small
                            loading={loading}
                            onClick={() => save({ interpretationText: text })}
                        >
                            {i18n.t('Post interpretation')}
                        </Button>
                        <Button
                            secondary
                            small
                            disabled={loading}
                            onClick={() => {
                                setText('')
                                setShowRichTextEditor(false)
                            }}
                        >
                            {i18n.t('Cancel')}
                        </Button>
                    </MessageButtonStrip>
                </>
            ) : (
                <Input
                    onFocus={() => setShowRichTextEditor(true)}
                    placeholder={inputPlaceholder}
                    disabled={disabled}
                />
            )}
        </MessageEditorContainer>
    )
}

InterpretationForm.propTypes = {
    disabled: PropTypes.bool,
    id: PropTypes.string,
    showNoTimeDimensionHelpText: PropTypes.bool,
    type: PropTypes.string,
}
