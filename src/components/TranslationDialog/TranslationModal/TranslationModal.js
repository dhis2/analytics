import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    CenteredContent,
    CircularLoader,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { TranslationForm } from './TranslationForm.js'
import { useTranslationsResults } from './useTranslationsResults.js'

const getTranslationsMutation = resource => ({
    resource: `${resource}/translations`,
    type: 'update',
    data: ({ translations }) => ({ translations }),
})

export const TranslationModal = ({
    objectToTranslate,
    fieldsToTranslate,
    onClose,
    onTranslationSaved,
}) => {
    const { show: showError } = useAlert(error => error, { critical: true })

    const [translations, setTranslations] = useState([])

    const endpointPath = new URL(objectToTranslate.href).pathname
    const endpointPathMatch = endpointPath.match(/api\/\d+\/(?<resource>.+)/)
    const resource = endpointPathMatch?.groups
        ? endpointPathMatch.groups.resource
        : null

    const { translationsData, fetching } = useTranslationsResults({
        resource,
    })

    const translationsMutation = useMemo(
        () => getTranslationsMutation(resource),
        []
    )
    const [updateTranslations, { loading: saveInProgress }] = useDataMutation(
        translationsMutation,
        {
            onComplete: () => {
                onTranslationSaved()
                onClose()
            },
            onError: error => {
                showError(error)
            },
        }
    )

    const save = () => updateTranslations({ translations })

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
            <ModalContent>
                {fetching && (
                    <CenteredContent>
                        <CircularLoader />
                    </CenteredContent>
                )}
                {translations.length && (
                    <TranslationForm
                        fieldsToTranslate={fieldsToTranslate}
                        objectToTranslate={objectToTranslate}
                        translations={translations}
                        onUpdateTranslations={setTranslations}
                    />
                )}
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button secondary onClick={onClose}>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button primary onClick={save} loading={saveInProgress}>
                        {i18n.t('Save translations')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

TranslationModal.propTypes = {
    fieldsToTranslate: PropTypes.array.isRequired,
    objectToTranslate: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onTranslationSaved: PropTypes.func.isRequired,
}
