// import { useDataMutation } from '@dhis2/app-runtime'
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
import React, { useState } from 'react'
import i18n from '../../locales/index.js'
import { modalStyles } from './FileMenu.styles.js'
import { supportedFileTypes, labelForFileType } from './utils.js'

export const RenameDialog = ({
    type,
    object,
    defaultVisName,
    onClose,
    onRename,
}) => {
    const [name, setName] = useState(object.name)
    const [description, setDescription] = useState(object.description)

    const renameObject = () => {
        onRename({ name: name || defaultVisName, description })
        onClose()
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
                        required
                        value={name}
                        onChange={({ value }) => setName(value)}
                        dataTest="file-menu-rename-modal-name"
                        placeholder="Jennifer chart"
                    />
                    <TextAreaField
                        label={i18n.t('Description')}
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
                        secondary
                        dataTest="file-menu-rename-modal-cancel"
                    >
                        {i18n.t('Cancel')}
                    </Button>
                    <Button
                        onClick={renameObject}
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
    defaultVisName: PropTypes.string,
    object: PropTypes.shape({
        description: PropTypes.string,
        name: PropTypes.string,
    }),
    type: PropTypes.oneOf(supportedFileTypes),
    onClose: PropTypes.func,
    onRename: PropTypes.func,
}
