import i18n from '@dhis2/d2-i18n'
import { applyDefaultHandler, getPrefixedValue } from './default.js'

export const applyBooleanHandler = (response, headerIndex) => {
    const dimensionId = response.headers[headerIndex].name
    const defaultResponse = applyDefaultHandler(response, headerIndex)

    return {
        ...defaultResponse,
        metaData: {
            ...defaultResponse.metaData,
            items: {
                ...defaultResponse.metaData.items,
                [getPrefixedValue('0', dimensionId)]: {
                    name: i18n.t('No'),
                },
                [getPrefixedValue('1', dimensionId)]: {
                    name: i18n.t('Yes'),
                },
            },
        },
    }
}
