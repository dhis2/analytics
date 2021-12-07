import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    CenteredContent,
    CircularLoader,
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableHead,
    DataTableRow,
    Input,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import cloneDeep from 'lodash/cloneDeep'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { LocalesSelect } from './LocalesSelect.js'
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
    const [translationLocale, setTranslationLocale] = useState()

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

    const camelCaseToUnderscores = field =>
        field
            .replace(/[a-z][A-Z]/g, match =>
                [match.chartAt(0), match.chartAt(1)].join('_')
            )
            .toLowerCase()

    const getTranslationIndexForField = field => {
        console.log('translations', translations, camelCaseToUnderscores(field))
        return translations.findIndex(
            element =>
                element.locale === translationLocale &&
                element.property.toLowerCase() === camelCaseToUnderscores(field)
        )
    }

    const getTranslationForField = field => {
        const translationIndex = getTranslationIndexForField(field)
        console.log(field, translationIndex)
        return translationIndex !== -1
            ? translations[translationIndex]?.value || ''
            : ''
    }

    const setTranslationForField = (field, translation) => {
        console.log('setTranslationField called', field, translation)
        const newTranslations = cloneDeep(translations)

        const newTranslation = {
            locale: translationLocale,
            property: camelCaseToUnderscores(field).toUpperCase(),
            value: translation,
        }

        const translationIndex = getTranslationIndexForField(field)

        if (translationIndex !== -1) {
            newTranslations.splice(translationIndex, 1, newTranslation)
        } else {
            newTranslations.push(newTranslation)
        }

        setTranslations(newTranslations)
    }

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
                <DataTable layout="fixed">
                    <DataTableHead>
                        <DataTableRow>
                            <DataTableColumnHeader fixed top="0">
                                {i18n.t('Base locale reference')}
                            </DataTableColumnHeader>
                            <DataTableColumnHeader fixed top="0">
                                <LocalesSelect
                                    selected={translationLocale}
                                    onChange={setTranslationLocale}
                                />
                            </DataTableColumnHeader>
                        </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>
                        {fieldsToTranslate.map((field, index) => (
                            <DataTableRow key={field}>
                                <DataTableCell>
                                    <div className="">
                                        {field}
                                        <Input
                                            value={objectToTranslate[field]}
                                            readOnly
                                        />
                                    </div>
                                </DataTableCell>
                                {translationLocale && (
                                    <DataTableCell>
                                        <div className="">
                                            {field}
                                            <Input
                                                value={getTranslationForField(
                                                    field
                                                )}
                                                onChange={({ value }) =>
                                                    setTranslationForField(
                                                        field,
                                                        value
                                                    )
                                                }
                                            />
                                        </div>
                                    </DataTableCell>
                                )}
                                {!translationLocale && index === 0 && (
                                    <DataTableCell
                                        rowSpan={String(
                                            fieldsToTranslate.length
                                        )}
                                    >
                                        <CenteredContent>
                                            {fetching ? (
                                                <CircularLoader />
                                            ) : (
                                                i18n.t(
                                                    'Choose a locale to translate from the menu above'
                                                )
                                            )}
                                        </CenteredContent>
                                    </DataTableCell>
                                )}
                            </DataTableRow>
                        ))}
                    </DataTableBody>
                </DataTable>
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
