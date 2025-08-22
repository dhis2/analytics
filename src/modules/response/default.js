import {
    isBooleanValueType,
    isNumericValueType,
    VALUE_TYPE_TEXT,
} from '../valueTypes.js'
import { NA_VALUE, PREFIX_SEPARATOR } from './response.js'

export const getUnique = (array) => [...new Set(array)]

export const getValuesUniqueSortedAsc = (values, valueType = VALUE_TYPE_TEXT) =>
    isNumericValueType(valueType) || isBooleanValueType(valueType)
        ? getUnique(values)
              .map((x) => [Number(x), x])
              .sort((a, b) => a[0] - b[0])
              .map((arr) => arr[1])
        : getUnique(values)
              .slice()
              .sort((a, b) => a.localeCompare(b))

export const getPrefixedValue = (value, prefix) =>
    `${prefix}${PREFIX_SEPARATOR}${value}`

export const getItems = (values, dimensionId, { itemFormatter } = {}) =>
    values.reduce((items, value) => {
        items[getPrefixedValue(value, dimensionId)] = {
            name: itemFormatter ? itemFormatter(value) : value,
        }
        return items
    }, {})

export const getDimensions = (values, dimensionId) => ({
    [dimensionId]: values.map((value) => getPrefixedValue(value, dimensionId)),
})

export const getRows = (rows, headerIndex, dimensionId) => {
    let row
    let value

    return rows.map((r) => {
        value = r[headerIndex]

        if (value !== NA_VALUE) {
            row = [...r]
            row[headerIndex] = getPrefixedValue(row[headerIndex], dimensionId)
            return row
        }

        return r
    })
}

export const applyDefaultHandler = (
    response,
    headerIndex,
    { itemFormatter } = {}
) => {
    const header = response.headers[headerIndex]
    const uniqueSortedValuesAsc = getValuesUniqueSortedAsc(
        response.rows
            .map((row) => row[headerIndex])
            .filter((value) => value !== NA_VALUE),
        header.valueType
    )

    return {
        ...response,
        metaData: {
            ...response.metaData,
            items: {
                ...response.metaData.items,
                ...getItems(uniqueSortedValuesAsc, header.name, {
                    itemFormatter,
                }),
            },
            dimensions: {
                ...response.metaData.dimensions,
                ...getDimensions(uniqueSortedValuesAsc, header.name),
            },
        },
        rows: [...getRows(response.rows, headerIndex, header.name)],
    }
}
