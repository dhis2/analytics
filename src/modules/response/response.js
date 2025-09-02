import i18n from '@dhis2/d2-i18n'
import {
    DIMENSION_ID_ORGUNIT,
    DIMENSION_ID_PERIOD,
} from '../predefinedDimensions.js'
import {
    isBooleanValueType,
    VALUE_TYPE_AGE,
    VALUE_TYPE_COORDINATE,
    VALUE_TYPE_DATE,
    VALUE_TYPE_DATETIME,
    VALUE_TYPE_PERCENTAGE,
} from '../valueTypes.js'
import { applyBooleanHandler } from './boolean.js'
import { applyDefaultHandler } from './default.js'
import { applyOptionSetHandler } from './optionSet.js'

export const NA_VALUE = ''
export const NA_VALUE_DISPLAY_NAME = i18n.t('No value')
export const PREFIX_SEPARATOR = '_'

export const itemFormatterByValueType = {
    [VALUE_TYPE_AGE]: (name) => name.replace(/ 00:00:00\.0$/, ''),
    [VALUE_TYPE_DATETIME]: (name) => name.replace(/:00\.0$/, ''),
    [VALUE_TYPE_DATE]: (name) => name.replace(/ 00:00:00\.0$/, ''),
    [VALUE_TYPE_PERCENTAGE]: (name) =>
        name.endsWith('.0') ? name.slice(0, -2) : name,
}

export const transformResponse = (response, { hideNaData = false } = {}) => {
    // Do not modify the original response
    // Rows is mapped by the handlers
    let transformedResponse = {
        ...response,
        metaData: {
            ...response.metaData,
            items: {
                ...response.metaData.items,
            },
            dimensions: {
                ...response.metaData.dimensions,
            },
        },
    }

    // Add index to all headers
    // Include only headers that are "meta" and skip "pe" and "ou"
    const metaHeaders = response.headers
        .map((header, index) => Object.assign({}, header, { index }))
        .filter(
            (header) =>
                Boolean(header.meta) &&
                ![DIMENSION_ID_PERIOD, DIMENSION_ID_ORGUNIT].includes(
                    header.name
                )
        )

    // Legendsets use uids and do not need transformation
    // Coordinate not supported
    // Option set and Boolean have separate handlers
    // All other types use default handler with specific item formatter
    metaHeaders.forEach((header) => {
        if (!(header.legendSet || header.valueType === VALUE_TYPE_COORDINATE)) {
            if (header.optionSet) {
                transformedResponse = applyOptionSetHandler(
                    transformedResponse,
                    header.index
                )
            } else if (isBooleanValueType(header.valueType)) {
                transformedResponse = applyBooleanHandler(
                    transformedResponse,
                    header.index
                )
            } else {
                transformedResponse = applyDefaultHandler(
                    transformedResponse,
                    header.index,
                    {
                        itemFormatter:
                            itemFormatterByValueType[header.valueType],
                    }
                )
            }
        }
    })

    // Add "No value" dimension item if "Hide NA data" option is disabled
    // Only add if there is at least one empty value
    if (!hideNaData) {
        metaHeaders.forEach((header) => {
            if (
                response.rows.map((row) => row[header.index]).includes(NA_VALUE)
            ) {
                transformedResponse.metaData.dimensions[header.name] = [
                    ...transformedResponse.metaData.dimensions[header.name],
                    NA_VALUE,
                ]
            }
        })
    }

    return transformedResponse
}
