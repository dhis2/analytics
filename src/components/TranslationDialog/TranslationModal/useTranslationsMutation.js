import { useDataMutation } from '@dhis2/app-runtime'
import { useMemo } from 'react'

const getTranslationsMutation = resource => ({
    resource: `${resource}/translations`,
    type: 'update',
    params: ({ translations }) => ({
        translations,
    }),
})

export const useTranslationsMutation = ({ resource, translations }) => {
    const translationsMutation = useMemo(
        () => getTranslationsMutation(resource),
        []
    )
    const [updateTranslations] = useDataMutation(translationsMutation)

    return {
        updateTranslations,
    }
}
