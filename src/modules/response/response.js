import { isBooleanValueType, isNumericValueType } from '../valueTypes.js'
import { applyBooleanHandler } from './boolean.js'
import { applyNumericHandler } from './numeric.js'
import { applyOptionSetHandler } from './optionSet.js'

export const removeNaDimensionItems = (obj) =>
    Object.keys(obj).reduce((acc, key) => {
        const value = obj[key]
        acc[key] = Array.isArray(value)
            ? value.filter((str) => str !== '')
            : value
        return acc
    }, {})

export const transformResponse = (response, { hideNaData } = {}) => {
    let transformedResponse = {
        ...response,
    }

    response.headers.forEach((header, index) => {
        if (header.meta) {
            if (header.optionSet) {
                transformedResponse = applyOptionSetHandler(
                    transformedResponse,
                    index
                )
            } else if (
                isNumericValueType(header.valueType) &&
                !header.legendSet
            ) {
                transformedResponse = applyNumericHandler(
                    transformedResponse,
                    index
                )
            } else if (isBooleanValueType(header.valueType)) {
                transformedResponse = applyBooleanHandler(
                    transformedResponse,
                    index
                )
            }
        }
    })

    if (hideNaData) {
        transformedResponse.metaData.dimensions = removeNaDimensionItems(
            transformedResponse.metaData.dimensions
        )
    }

    return transformedResponse
}
