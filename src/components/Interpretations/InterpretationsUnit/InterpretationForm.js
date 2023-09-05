import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, Input } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import {
    RichTextEditor,
    MessageEditorContainer,
    MessageButtonStrip,
} from '../common/index.js'

export const InterpretationForm = ({
    type,
    id,
    currentUser,
    disabled,
    showNoTimeDimensionWarning,
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
                <div>
                    <RichTextEditor
                        disabled={saveMutationInProgress}
                        inputPlaceholder={inputPlaceholder}
                        onChange={setInterpretationText}
                        value={interpretationText}
                        warningText={
                            showNoTimeDimensionWarning
                                ? i18n.t(
                                      'Unable to create a snapshot of this visualization, because it contains no time dimension. Beware that others viewing this interpretation in the future may see more data than currently available.'
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
                </div>
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
    showNoTimeDimensionWarning: PropTypes.bool,
    type: PropTypes.string,
    onSave: PropTypes.func,
}
