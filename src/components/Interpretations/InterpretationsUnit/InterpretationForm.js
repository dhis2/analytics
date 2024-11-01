import { useDataMutation } from '@dhis2/app-runtime'
import { Button, Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import i18n from '../../../locales/index.js'
import { RichTextEditor } from '../../RichText/index.js'
import { MessageEditorContainer, MessageButtonStrip } from '../common/index.js'

export const InterpretationForm = ({
    type,
    id,
    currentUser,
    disabled,
    showNoTimeDimensionHelpText,
    onSave,
}) => {
    const [showRichTextEditor, setShowRichTextEditor] = useState(false)
    const [interpretationText, setInterpretationText] = useState('')

    const saveMutationRef = useRef({
        resource: `interpretations/${type}/${id}`,
        type: 'create',
        data: ({ interpretationText }) => interpretationText,
    })

    const [save, { loading: saveMutationInProgress }] = useDataMutation(
        saveMutationRef.current,
        {
            onComplete: () => {
                setShowRichTextEditor(false)
                setInterpretationText('')

                onSave()
            },
        }
    )

    const inputPlaceholder = i18n.t('Write an interpretation')

    return (
        <MessageEditorContainer
            currentUser={currentUser}
            dataTest="interpretation-form"
        >
            {showRichTextEditor ? (
                <>
                    <RichTextEditor
                        disabled={saveMutationInProgress}
                        inputPlaceholder={inputPlaceholder}
                        onChange={setInterpretationText}
                        value={interpretationText}
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
                            loading={saveMutationInProgress}
                            onClick={() => save({ interpretationText })}
                        >
                            {i18n.t('Post interpretation')}
                        </Button>
                        <Button
                            secondary
                            small
                            disabled={saveMutationInProgress}
                            onClick={() => {
                                setInterpretationText('')
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
    currentUser: PropTypes.object,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    showNoTimeDimensionHelpText: PropTypes.bool,
    type: PropTypes.string,
    onSave: PropTypes.func,
}
