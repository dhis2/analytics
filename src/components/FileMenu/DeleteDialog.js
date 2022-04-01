import { useDataMutation } from '@dhis2/app-runtime'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import i18n from '../../locales/index.js'
import {
    supportedFileTypes,
    endpointFromFileType,
    labelForFileType,
} from './utils.js'

const getMutation = (type) => ({
    resource: endpointFromFileType(type),
    id: ({ id }) => id,
    type: 'delete',
})

export const DeleteDialog = ({ type, id, onClose, onDelete, onError }) => {
    const mutation = useMemo(() => getMutation(type), [])
    const [mutate] = useDataMutation(mutation, {
        variables: { id },
        onError: (error) => {
            onError(error)
            onClose()
        },
        onComplete: () => {
            onDelete()
        },
    })

    return (
        <Modal onClose={onClose} dataTest="file-menu-delete-modal">
            <ModalTitle>
                {i18n.t('Delete {{fileType}}', {
                    fileType: labelForFileType(type),
                })}
            </ModalTitle>
            <ModalContent>
                {i18n.t(
                    'This {{fileType}} and related interpretations will be deleted. Continue?',
                    {
                        fileType: labelForFileType(type),
                    }
                )}
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button
                        onClick={onClose}
                        secondary
                        dataTest="file-menu-delete-modal-cancel"
                    >
                        {i18n.t('Cancel')}
                    </Button>
                    <Button
                        onClick={mutate}
                        destructive
                        dataTest="file-menu-delete-modal-delete"
                    >
                        {i18n.t('Delete')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

DeleteDialog.propTypes = {
    id: PropTypes.string,
    type: PropTypes.oneOf(supportedFileTypes),
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
    onError: PropTypes.func,
}
