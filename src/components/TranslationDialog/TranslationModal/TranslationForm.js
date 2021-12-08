import i18n from '@dhis2/d2-i18n'
import {
    CenteredContent,
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableHead,
    DataTableRow,
    Input,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { LocalesSelect } from './LocalesSelect.js'

export const TranslationForm = ({
    fieldsToTranslate,
    objectToTranslate,
    translations,
    onUpdateTranslations,
}) => {
    const [newTranslations, setNewTranslations] = useState(translations)
    const [translationLocale, setTranslationLocale] = useState()

    const camelCaseToUnderscores = field =>
        field
            .replace(/[a-z][A-Z]/g, match =>
                [match.chartAt(0), match.chartAt(1)].join('_')
            )
            .toLowerCase()

    const getTranslationIndexForField = field => {
        console.log(
            'translations',
            newTranslations,
            camelCaseToUnderscores(field)
        )
        return newTranslations.findIndex(
            element =>
                element.locale === translationLocale &&
                element.property.toLowerCase() === camelCaseToUnderscores(field)
        )
    }

    const getTranslationForField = field => {
        const translationIndex = getTranslationIndexForField(field)
        console.log(field, translationIndex)
        return translationIndex !== -1
            ? newTranslations[translationIndex]?.value || ''
            : ''
    }

    const setTranslationForField = (field, translation) => {
        console.log('setTranslationField called', field, translation)

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

    return (
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
                                        value={getTranslationForField(field)}
                                        onChange={({ value }) =>
                                            setTranslationForField(field, value)
                                        }
                                    />
                                </div>
                            </DataTableCell>
                        )}
                        {!translationLocale && index === 0 && (
                            <DataTableCell
                                rowSpan={String(fieldsToTranslate.length)}
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
    )
}

TranslationForm.propTypes = {
    fieldsToTranslate: PropTypes.array.isRequired,
    objectToTranslate: PropTypes.object.isRequired,
    translations: PropTypes.array.isRequired,
    onUpdateTranslations: PropTypes.func.isRequired,
}
