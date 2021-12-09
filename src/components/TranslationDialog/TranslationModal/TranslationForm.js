import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    CenteredContent,
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableHead,
    DataTableRow,
    Input,
    ModalActions,
    ModalContent,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { LocalesSelect } from './LocalesSelect.js'

const SESSION_STORAGE_TRANSLATION_LOCALE_KEY =
    'translation-dialog-selected-locale'

const getTranslationsMutation = resource => ({
    resource: `${resource}/translations`,
    type: 'update',
    data: ({ translations }) => ({ translations }),
})

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

    const { show: showError } = useAlert(error => error, { critical: true })

    const camelCaseToUnderscores = field =>
        field
            .replace(/[a-z][A-Z]/g, match =>
                [match.charAt(0), match.charAt(1)].join('_')
            )
            .toLowerCase()

    const getTranslationIndexForField = field =>
        newTranslations.findIndex(
            element =>
                element.locale === translationLocale &&
                element.property.toLowerCase() === camelCaseToUnderscores(field)
        )

    const getTranslationForField = field => {
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

        const updatedTranslations = [...newTranslations]

        if (translationIndex !== -1) {
            updatedTranslations.splice(translationIndex, 1, newTranslation)
        } else {
            updatedTranslations.push(newTranslation)
        }

        setNewTranslations(updatedTranslations)
    }

    const translationsMutation = useMemo(
        () => getTranslationsMutation(resource),
        []
    )

    const [saveTranslations, { loading: saveInProgress }] = useDataMutation(
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

    const onLocaleChange = locale => {
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
            <ModalActions>
                <ButtonStrip>
                    <Button secondary onClick={onClose}>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button
                        primary
                        onClick={save}
                        loading={saveInProgress}
                        disabled={!translationLocale}
                    >
                        {i18n.t('Save translations')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
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
