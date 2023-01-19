import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    CenteredContent,
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableHead,
    DataTableRow,
    ModalContent,
    TextAreaField,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { LocalesSelect } from './LocalesSelect.js'
import { TranslationModalActions } from './TranslationModalActions.js'

const SESSION_STORAGE_TRANSLATION_LOCALE_KEY =
    'translation-dialog-selected-locale'

const camelCaseToUnderscores = (field) =>
    field
        .replace(/[a-z][A-Z]/g, (match) =>
            [match.charAt(0), match.charAt(1)].join('_')
        )
        .toLowerCase()

export const TranslationForm = ({
    fieldsToTranslate,
    objectToTranslate,
    translations,
    resource,
    onTranslationSaved,
    onClose,
}) => {
    const [newTranslations, setNewTranslations] = useState()
    const [translationLocale, setTranslationLocale] = useState()
    const [fieldsTranslations, setFieldsTranslations] = useState({})

    const { show: showError } = useAlert((error) => error, { critical: true })

    const getTranslationIndexForField = (field) =>
        newTranslations.findIndex(
            (element) =>
                element.locale === translationLocale &&
                element.property.toLowerCase() === camelCaseToUnderscores(field)
        )

    const getTranslationForField = (field) => {
        const translationIndex = getTranslationIndexForField(field)

        return translationIndex !== -1
            ? newTranslations[translationIndex]?.value || ''
            : ''
    }

    const setTranslationForField = (field, translation) => {
        const newTranslation = {
            locale: translationLocale,
            property: camelCaseToUnderscores(field).toUpperCase(),
            value: translation,
        }

        const translationIndex = getTranslationIndexForField(field)

        if (translationIndex === -1) {
            // non existing translation, adding new
            setNewTranslations([...newTranslations, newTranslation])
        } else {
            // cleared existing translation, remove it from the list
            if (!translation) {
                setNewTranslations(
                    newTranslations.reduce((tmp, translation, index) => {
                        if (index !== translationIndex) {
                            tmp.push(translation)
                        }

                        return tmp
                    }, [])
                )
            }
            // replace existing translation with new one
            else {
                setNewTranslations(
                    newTranslations.map((translation, index) =>
                        index === translationIndex
                            ? newTranslation
                            : translation
                    )
                )
            }
        }
    }

    const i18nMutationRef = useRef({
        resource: 'i18n',
        type: 'create',
        data: fieldsToTranslate.map(camelCaseToUnderscores),
    })

    const [fetchFieldsTranslations] = useDataMutation(i18nMutationRef.current, {
        onComplete: (res) => setFieldsTranslations(res),
        onError: (error) => showError(error),
    })

    const translationsMutationRef = useRef({
        resource: `${resource}/translations`,
        type: 'update',
        data: ({ translations }) => ({ translations }),
    })

    const [saveTranslations, { loading: saveInProgress }] = useDataMutation(
        translationsMutationRef.current,
        {
            onComplete: () => {
                onTranslationSaved()
            },
            onError: (error) => showError(error),
        }
    )

    const onLocaleChange = (locale) => {
        setTranslationLocale(locale)

        window.sessionStorage.setItem(
            SESSION_STORAGE_TRANSLATION_LOCALE_KEY,
            locale
        )
    }

    const save = () => saveTranslations({ translations: newTranslations })

    useEffect(
        () =>
            setTranslationLocale(
                window.sessionStorage.getItem(
                    SESSION_STORAGE_TRANSLATION_LOCALE_KEY
                )
            ),
        []
    )

    useEffect(() => {
        const fetchTranslations = () =>
            fetchFieldsTranslations(fieldsToTranslate)

        fetchTranslations()
    }, [fieldsToTranslate])

    useEffect(() => setNewTranslations(translations), [translations])

    return (
        <>
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
                                    onChange={onLocaleChange}
                                />
                            </DataTableColumnHeader>
                        </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>
                        {fieldsToTranslate.map((field, index) => (
                            <DataTableRow key={field}>
                                <DataTableCell>
                                    <TextAreaField
                                        label={fieldsTranslations[field]}
                                        value={objectToTranslate[field]}
                                        readOnly
                                        rows={3}
                                    />
                                </DataTableCell>
                                {translationLocale && (
                                    <DataTableCell>
                                        <TextAreaField
                                            label={fieldsTranslations[field]}
                                            value={getTranslationForField(
                                                field
                                            )}
                                            onChange={({ value }) =>
                                                setTranslationForField(
                                                    field,
                                                    value
                                                )
                                            }
                                            rows={3}
                                        />
                                    </DataTableCell>
                                )}
                                {!translationLocale && index === 0 && (
                                    <DataTableCell
                                        rowSpan={String(
                                            fieldsToTranslate.length
                                        )}
                                    >
                                        <CenteredContent>
                                            {i18n.t(
                                                'Choose a locale to translate from the menu above'
                                            )}
                                        </CenteredContent>
                                    </DataTableCell>
                                )}
                            </DataTableRow>
                        ))}
                    </DataTableBody>
                </DataTable>
            </ModalContent>
            <TranslationModalActions
                onClose={onClose}
                onSave={save}
                saveInProgress={saveInProgress}
                saveButtonDisabled={!translationLocale}
            />
        </>
    )
}

TranslationForm.propTypes = {
    fieldsToTranslate: PropTypes.array.isRequired,
    objectToTranslate: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    translations: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    onTranslationSaved: PropTypes.func.isRequired,
}
