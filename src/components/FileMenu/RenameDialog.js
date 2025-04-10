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
import { getDisplayNameByVisType } from '../../modules/visTypes.js'
import { modalStyles } from './FileMenu.styles.js'
import { supportedFileTypes, labelForFileType } from './utils.js'

const getDefaultVisName = (visualization) => {
    console.log('jj visualization', visualization)
    if (!visualization) {
        return i18n.t('Untitled visualization')
    }
    const visualizationType = getDisplayNameByVisType(visualization.type)
    const dateFormat = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    }
    const date = visualization.created
        ? new Date(visualization.created).toLocaleDateString(
              undefined,
              dateFormat
          )
        : new Date().toLocaleDateString(undefined, dateFormat)

    return i18n.t('Untitled {{visualizationType}} visualization, {{date}}', {
        visualizationType,
        date,
    })
}

export const RenameDialog = ({ type, object, onClose, onRename }) => {
    const defaultVisName = getDefaultVisName(object)
    console.log('jj defaultVisName', defaultVisName)
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
                        placeholder={defaultVisName}
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
    object: PropTypes.shape({
        description: PropTypes.string,
        name: PropTypes.string,
    }),
    type: PropTypes.oneOf(supportedFileTypes),
    onClose: PropTypes.func,
    onRename: PropTypes.func,
}
