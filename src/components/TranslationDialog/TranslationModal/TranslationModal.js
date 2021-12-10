import i18n from '@dhis2/d2-i18n'
import {
    CenteredContent,
    CircularLoader,
    Modal,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { TranslationForm } from './TranslationForm.js'
import { TranslationModalActions } from './TranslationModalActions.js'
import { useTranslationsResults } from './useTranslationsResults.js'

export const TranslationModal = ({
    objectToTranslate,
    fieldsToTranslate,
    onClose,
    onTranslationSaved,
}) => {
    const [translations, setTranslations] = useState([])

    const endpointPath = new URL(objectToTranslate.href).pathname
    const endpointPathMatch = endpointPath.match(/api\/\d+\/(?<resource>.+)/)
    const resource = endpointPathMatch?.groups
        ? endpointPathMatch.groups.resource
        : null

    const { translationsData, fetching } = useTranslationsResults({
        resource,
    })

    useEffect(() => {
        if (translationsData) {
            setTranslations(translationsData)
        }
    }, [translationsData])

    return (
        <Modal large position="middle" onClose={onClose}>
            <ModalTitle>
                {i18n.t('Translate: {{objectName}}', {
                    objectName: objectToTranslate.name || 'TEXT', // XXX
                    nsSeparator: '^^',
                })}
            </ModalTitle>
            {fetching ? (
                <>
                    <ModalContent>
                        <CenteredContent>
                            <CircularLoader />
                        </CenteredContent>
                    </ModalContent>
                    <TranslationModalActions
                        onClose={onClose}
                        saveButtonDisabled={true}
                    />
                </>
            ) : (
                <TranslationForm
                    fieldsToTranslate={fieldsToTranslate}
                    objectToTranslate={objectToTranslate}
                    translations={translations}
                    onTranslationSaved={onTranslationSaved}
                    resource={resource}
                    onClose={onClose}
                />
            )}
        </Modal>
    )
}

TranslationModal.propTypes = {
    fieldsToTranslate: PropTypes.array.isRequired,
    objectToTranslate: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onTranslationSaved: PropTypes.func.isRequired,
}
