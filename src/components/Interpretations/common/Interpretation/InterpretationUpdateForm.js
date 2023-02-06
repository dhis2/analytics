import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, spacers, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
    MessageEditorContainer,
    RichTextEditor,
    MessageButtonStrip,
    InterpretationSharingLink,
} from '../index.js'

const mutation = {
    resource: 'interpretations',
    type: 'update',
    partial: false,
    id: ({ id }) => id,
    data: ({ interpretationText }) => interpretationText,
}

export const InterpretationUpdateForm = ({
    close,
    currentUser,
    id,
    onComplete,
    showSharingLink,
    text,
}) => {
    const [interpretationText, setInterpretationText] = useState(text || '')
    const [update, { loading, error }] = useDataMutation(mutation, {
        onComplete: () => {
            onComplete()
            close()
        },
        variables: { id },
    })

    const errorText = error
        ? error.message || i18n.t('Could not update interpretation')
        : ''

    return (
        <div className="message">
            <MessageEditorContainer currentUser={currentUser}>
                <RichTextEditor
                    inputPlaceholder={i18n.t('Enter interpretation text')}
                    onChange={setInterpretationText}
                    value={interpretationText}
                    disabled={loading}
                    errorText={errorText}
                />
                {showSharingLink && (
                    <InterpretationSharingLink id={id} type="interpretation" />
                )}
                <MessageButtonStrip>
                    <Button
                        loading={loading}
                        primary
                        small
                        onClick={() => update({ interpretationText })}
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
InterpretationUpdateForm.propTypes = {
    close: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    onComplete: PropTypes.func.isRequired,
    showSharingLink: PropTypes.bool,
    text: PropTypes.string,
}
