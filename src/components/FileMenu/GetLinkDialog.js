import { useConfig } from '@dhis2/app-runtime'
import {
    Modal,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    IconCopy24,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import { styles } from './GetLinkDialog.styles.js'
import { supportedFileTypes, appPathFor } from './utils.js'

export const GetLinkDialog = ({ type, id, onClose }) => {
    const { apiVersion, baseUrl } = useConfig()

    const appBaseUrl = new URL(
        baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`,
        self.location.href
    ).href

    const appUrl = new URL(appPathFor(type, id, apiVersion), appBaseUrl).href

    return (
        <Modal onClose={onClose}>
            <style jsx>{styles}</style>
            <ModalContent>
                <p>{i18n.t('Open in this app')}</p>
                <div className="link-container">
                    <a href={appUrl}>{appUrl}</a>
                    <Button
                        icon={<IconCopy24 />}
                        small
                        onClick={() => navigator.clipboard.writeText(appUrl)}
                        aria-label={i18n.t('Copy to clipboard')}
                    />
                </div>
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
