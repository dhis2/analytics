import i18n from '@dhis2/d2-i18n'
import { applyNumericHandler, getPrefixedValue } from './numeric.js'

export const applyBooleanHandler = (response, headerIndex) => {
    const dimensionId = response.headers[headerIndex].name
    const numericResponse = applyNumericHandler(response, headerIndex)

    return {
        ...numericResponse,
        metaData: {
            ...numericResponse.metaData,
            items: {
                ...numericResponse.metaData.items,
                [getPrefixedValue('0', dimensionId)]: {
                    name: i18n.t('No'),
                },
                [getPrefixedValue('1', dimensionId)]: {
                    name: i18n.t('Yes'),
                },
                [getPrefixedValue('', dimensionId)]: {
                    name: i18n.t('N/A'),
                },
            },
        },
    }
}
