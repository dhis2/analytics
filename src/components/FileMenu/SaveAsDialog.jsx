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

const NAME_MAXLENGTH = 230

export const SaveAsDialog = ({ type, object, onClose, onSaveAs }) => {
    const [name, setName] = useState(
        object?.displayName || object?.name
            ? i18n.t('{{- objectName}} (copy)', {
                  objectName: object.name,
              })
            : ''
    )
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
        <Modal onClose={onClose} dataTest="file-menu-saveas-modal">
            <style jsx>{modalStyles}</style>
            <ModalTitle>
                {i18n.t('Save {{fileType}} as', {
                    fileType: labelForFileType(type),
                })}
            </ModalTitle>
            <ModalContent>
                <div className="modal-content">
                    <InputField
                        label={i18n.t('Name')}
                        value={name}
                        onChange={({ value }) =>
                            setName(value.substring(0, NAME_MAXLENGTH))
                        }
                        dataTest="file-menu-saveas-modal-name"
                    />
                    <TextAreaField
                        label={i18n.t('Description')}
                        value={description}
                        rows={3}
                        onChange={({ value }) => setDescription(value)}
                        dataTest="file-menu-saveas-modal-description"
                    />
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button
                        onClick={onClose}
                        secondary
                        dataTest="file-menu-saveas-modal-cancel"
                    >
                        {i18n.t('Cancel')}
                    </Button>
                    <Button
                        onClick={saveObjectAs}
                        primary
                        dataTest="file-menu-saveas-modal-save"
                    >
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
        displayName: PropTypes.string,
        name: PropTypes.string,
    }),
    type: PropTypes.oneOf(supportedFileTypes),
    onClose: PropTypes.func,
    onSaveAs: PropTypes.func,
}
