import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { RichTextEditor } from '../../../RichText/index.js'
import {
    useUpdateInterpretationText,
    useInterpretationsCurrentUser,
} from '../../InterpretationsProvider/hooks.js'
import {
    MessageEditorContainer,
    MessageButtonStrip,
    InterpretationSharingLink,
} from '../index.js'

export const InterpretationUpdateForm = ({
    id,
    onComplete,
    showSharingLink,
    text,
}) => {
    const currentUser = useInterpretationsCurrentUser()
    const [interpretationText, setInterpretationText] = useState(text || '')
    const { show: showErrorAlert } = useAlert(
        i18n.t('Could not update interpretation text'),
        { critical: true }
    )
    const [update, { loading, error }] = useUpdateInterpretationText({
        id,
        text: interpretationText,
        onComplete,
        onError: showErrorAlert,
    })

    const errorText = error
        ? error.message || i18n.t('Could not update interpretation')
        : ''

    return (
        <MessageEditorContainer currentUserName={currentUser.name}>
            <RichTextEditor
                inputPlaceholder={i18n.t('Enter interpretation text')}
                onChange={setInterpretationText}
                value={interpretationText}
                disabled={loading}
                errorText={errorText}
            />

            <MessageButtonStrip>
                <Button
                    loading={loading}
                    primary
                    small
                    onClick={() => update({ interpretationText })}
                >
                    {i18n.t('Update')}
                </Button>
                <Button disabled={loading} secondary small onClick={onComplete}>
                    {i18n.t('Cancel')}
                </Button>
                {showSharingLink && (
                    <InterpretationSharingLink id={id} type="interpretation" />
                )}
            </MessageButtonStrip>
        </MessageEditorContainer>
    )
}
InterpretationUpdateForm.propTypes = {
    id: PropTypes.string.isRequired,
    onComplete: PropTypes.func.isRequired,
    showSharingLink: PropTypes.bool,
    text: PropTypes.string,
}
