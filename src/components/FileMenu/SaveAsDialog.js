import React, { useState } from 'react'

import PropTypes from '@dhis2/prop-types'
import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    InputField,
    TextAreaField,
} from '@dhis2/ui'

import { supportedFileTypes } from './utils'

export const SaveAsDialog = ({ type, object, onClose, onSaveAs }) => {
    const [name, setName] = useState(object?.name)
    const [description, setDescription] = useState(object?.description)

    // the actual API request is done in the app
    const saveObjectAs = () => {
        onSaveAs({
            name,
            description,
        })

        onClose()
    }

    return (
        <Modal onClose={onClose}>
            <ModalTitle>
                {i18n.t('Save {{fileType}} as', { fileType: type })}
            </ModalTitle>
            <ModalContent>
                <InputField
                    label={i18n.t('Name')}
                    required
                    value={name}
                    onChange={({ value }) => setName(value)}
                />
                <TextAreaField
                    label={i18n.t('Description')}
                    value={description}
                    rows={3}
                    onChange={({ value }) => setDescription(value)}
                />
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose} secondary>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button onClick={saveObjectAs} primary>
                        {i18n.t('Save')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

SaveAsDialog.propTypes = {
    object: PropTypes.shape({
        description: PropTypes.string,
        name: PropTypes.string,
    }),
    type: PropTypes.oneOf(supportedFileTypes),
    onClose: PropTypes.func,
    onSaveAs: PropTypes.func,
}
