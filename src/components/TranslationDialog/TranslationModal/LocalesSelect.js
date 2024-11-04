import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { SingleSelect, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

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
