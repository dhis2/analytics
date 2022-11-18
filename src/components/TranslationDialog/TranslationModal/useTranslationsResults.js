import { useAlert, useDataQuery } from '@dhis2/app-runtime'
import { useRef } from 'react'
import i18n from '../../../locales/index.js'

export const useTranslationsResults = ({ resource }) => {
    const translationsQueryRef = useRef({
        translations: {
            resource: `${resource}/translations`,
        },
    })

    const { data, fetching, refetch } = useDataQuery(
        translationsQueryRef.current,
        {
            onError: (error) => showError(error),
        }
    )

    const { show: showError } = useAlert(
        (error) => error.message || i18n.t('Could not load translations'),
        {
            critical: true,
            actions: [{ label: i18n.t('Retry'), onClick: refetch }],
        }
    )

    return {
        translationsData: fetching ? undefined : data.translations.translations,
        fetching,
    }
}
