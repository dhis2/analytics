import React, { useMemo, useState } from 'react'

import PropTypes from '@dhis2/prop-types'
import i18n from '@dhis2/d2-i18n'
import { useDataMutation } from '@dhis2/app-runtime'
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

import { supportedFileTypes, endpointFromFileType } from './utils'

const getMutation = type => ({
    resource: endpointFromFileType(type),
    id: ({ id }) => id,
    type: 'update',
    partial: true,
    data: ({ name, description }) => ({ name, description }),
})

export const RenameDialog = ({
    type,
    id,
    object,
    onClose,
    onRename,
    onError,
}) => {
    const [name, setName] = useState(object.name)
    const [description, setDescription] = useState(object.description)

    const mutation = useMemo(() => getMutation(type), [])
    const [mutate, { loading, error }] = useDataMutation(mutation)

    const renameObject = async () => {
        await mutate({
            id,
            name,
            description,
        })

        onRename({ name, description })
        onClose()
    }

    if (error) {
        onError(error)
        onClose()
    }

    return (
        <Modal onClose={onClose}>
            <ModalTitle>
                {i18n.t('Rename {{fileType}}', { fileType: type })}
            </ModalTitle>
            <ModalContent>
                <InputField
                    label={i18n.t('Name')}
                    disabled={loading}
                    required
                    value={name}
                    onChange={({ value }) => setName(value)}
                />
                <TextAreaField
                    label={i18n.t('Description')}
                    disabled={loading}
                    value={description}
                    rows={3}
                    onChange={({ value }) => setDescription(value)}
                />
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose} disabled={loading} secondary>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button onClick={renameObject} disabled={loading} primary>
                        {i18n.t('Rename')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

RenameDialog.propTypes = {
    id: PropTypes.string,
    object: PropTypes.shape({
        id: PropTypes.string.isRequired,
        description: PropTypes.string,
        name: PropTypes.string,
    }),
    type: PropTypes.oneOf(supportedFileTypes),
    onClose: PropTypes.func,
    onError: PropTypes.func,
    onRename: PropTypes.func,
}
