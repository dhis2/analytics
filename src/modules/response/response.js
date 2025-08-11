import i18n from '@dhis2/d2-i18n'
import { isBooleanValueType, isNumericValueType } from '../valueTypes.js'
import { applyBooleanHandler } from './boolean.js'
import { applyNumericHandler } from './numeric.js'
import { applyOptionSetHandler } from './optionSet.js'

export const NA_VALUE = ''

export const transformResponse = (response, { hideNaData } = {}) => {
    let transformedResponse = {
        ...response,
    }

    const metaHeaders = response.headers
        .map((header, index) => ({
            ...header,
            index,
        }))
        .filter((header) => Boolean(header.meta))

    metaHeaders.forEach((header) => {
        if (header.optionSet) {
            transformedResponse = applyOptionSetHandler(
                transformedResponse,
                header.index
            )
        } else if (isNumericValueType(header.valueType) && !header.legendSet) {
            transformedResponse = applyNumericHandler(
                transformedResponse,
                header.index
            )
        } else if (isBooleanValueType(header.valueType)) {
            transformedResponse = applyBooleanHandler(
                transformedResponse,
                header.index
            )
        }
    })

    if (!hideNaData) {
        metaHeaders.forEach((header) => {
            if (
                response.rows.map((row) => row[header.index]).includes(NA_VALUE)
            ) {
                transformedResponse.metaData.dimensions[
                    header.name
                ].dimensions.push(NA_VALUE)
            }
        })

        transformedResponse.metaData.items[NA_VALUE] = {
            name: i18n.t('N/A'),
        }
    }

    return transformedResponse
}
