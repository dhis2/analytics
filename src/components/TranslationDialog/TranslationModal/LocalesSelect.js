import { useDataQuery } from '@dhis2/app-runtime'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'

const query = {
    locales: {
        resource: 'locales/db',
    },
}

export const LocalesSelect = ({ onChange, selected }) => {
    const { data, fetching } = useDataQuery(query)

    return (
        <SingleSelect
            prefix={
                selected ? i18n.t('Translating to') : i18n.t('Choose a locale')
            }
            onChange={({ selected }) => onChange(selected)}
            loading={fetching}
            selected={data && selected ? selected : ''}
            dense
        >
            {data &&
                data.locales
                    // XXX remove duplicates ?! fr_SN - French (Senegal)
                    .reduce((locales, { locale, name }) => {
                        if (!locales.find((entry) => entry.locale === locale)) {
                            locales.push({ locale, name })
                        }

                        return locales
                    }, [])
                    .map(({ locale, name }) => (
                        <SingleSelectOption
                            key={locale}
                            value={locale}
                            label={name}
                        />
                    ))}
        </SingleSelect>
    )
}

LocalesSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.string,
}
