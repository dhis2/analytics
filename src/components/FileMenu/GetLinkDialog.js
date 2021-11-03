import { useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import {
    Modal,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
} from '@dhis2/ui'
import React from 'react'
import i18n from '../../locales/index.js'
import { supportedFileTypes, appPathFor } from './utils'

export const GetLinkDialog = ({ type, id, onClose }) => {
    const { baseUrl } = useConfig()

    // TODO simply use href from the visualization object?
    const appUrl = new URL(
        `${baseUrl}/${appPathFor(type, id)}`,
        `${window.location.origin}${window.location.pathname}`
    )

    return (
        <Modal onClose={onClose}>
            <ModalContent>
                <p>{i18n.t('Open in this app')}</p>
                <a href={appUrl.href}>{appUrl.href}</a>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose} secondary>
                        {i18n.t('Close')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

GetLinkDialog.propTypes = {
    id: PropTypes.string,
    type: PropTypes.oneOf(supportedFileTypes),
    onClose: PropTypes.func,
}
