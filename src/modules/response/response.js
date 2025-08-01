import { isBooleanValueType, isNumericValueType } from '../valueTypes.js'
import { applyBooleanHandler } from './boolean.js'
import { applyNumericHandler } from './numeric.js'
import { applyOptionSetHandler } from './optionSet.js'

export const transformResponse = (response) => {
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

    return transformedResponse
}
