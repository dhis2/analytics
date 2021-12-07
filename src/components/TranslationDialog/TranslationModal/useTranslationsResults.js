import { useAlert, useDataQuery } from '@dhis2/app-runtime'
import { useEffect, useMemo, useState } from 'react'

const getTranslationsQuery = resource => ({
    translations: {
        resource: `${resource}/translations`,
    },
})

export const useTranslationsResults = ({ resource }) => {
    const { show: showError } = useAlert(error => error, { critical: true })
    const [translationsData, setTranslationsData] = useState([])

    const translationsQuery = useMemo(() => getTranslationsQuery(resource), [])
    const { data, fetching } = useDataQuery(translationsQuery, {
        onError: error => showError(error),
    })

    useEffect(() => {
        if (data) {
            setTranslationsData(data.translations.translations)
        }
    }, [data])

    return {
        translationsData,
        fetching,
        clear: () => setTranslationsData([]),
    }
}
