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
import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import i18n from '../../locales/index.js'
import { modalStyles } from './FileMenu.styles.js'
import {
    supportedFileTypes,
    endpointFromFileType,
    labelForFileType,
} from './utils.js'

const formatPayload = (name, description) => {
    const payload = [{ op: 'add', path: '/name', value: name }]

    if (description) {
        payload.push({
            op: 'add',
            path: '/description',
            value: description,
        })
    }

    return payload
}

const getMutation = (type) => ({
    resource: endpointFromFileType(type),
    id: ({ id }) => id,
    type: 'json-patch',
    data: ({ name, description }) => formatPayload(name, description),
})

export const RenameDialog = ({ type, object, onClose, onRename, onError }) => {
    const [name, setName] = useState(object.name)
    const [description, setDescription] = useState(object.description)

    const mutation = useMemo(() => getMutation(type), [type])
    const [mutate, { loading }] = useDataMutation(mutation, {
        onError: (error) => {
            onError(error)
            onClose()
        },
        onComplete: () => {
            onRename({ name, description })
            onClose()
        },
    })

    const renameObject = () => {
        mutate({
            id: object.id,
            name,
            description,
        })
    }

    return (
        <Modal onClose={onClose} dataTest="file-menu-rename-modal">
            <style jsx>{modalStyles}</style>
            <ModalTitle>
                {i18n.t('Rename {{fileType}}', {
                    fileType: labelForFileType(type),
                })}
            </ModalTitle>
            <ModalContent>
                <div className="modal-content">
                    <InputField
                        label={i18n.t('Name')}
                        disabled={loading}
                        required
                        value={name}
                        onChange={({ value }) => setName(value)}
                        dataTest="file-menu-rename-modal-name"
                    />
                    <TextAreaField
                        label={i18n.t('Description')}
                        disabled={loading}
                        value={description}
                        rows={3}
                        onChange={({ value }) => setDescription(value)}
                        dataTest="file-menu-rename-modal-description"
                    />
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button
                        onClick={onClose}
                        disabled={loading}
                        secondary
                        dataTest="file-menu-rename-modal-cancel"
                    >
                        {i18n.t('Cancel')}
                    </Button>
                    <Button
                        onClick={renameObject}
                        disabled={loading}
                        primary
                        dataTest="file-menu-rename-modal-rename"
                    >
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
