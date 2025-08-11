import { NA_VALUE } from './response.js'

export const getUnique = (array) => [...new Set(array)]

export const sortStringsAsNumbersAsc = (arr) => {
    return arr.slice().sort((a, b) => {
        if (a === NA_VALUE && b === NA_VALUE) {
            return 0
        }
        if (a === NA_VALUE) {
            return 1
        }
        if (b === NA_VALUE) {
            return -1
        }
        return Number(a) - Number(b)
    })
}

export const getUniqueSortedValues = (rows, headerIndex) =>
    sortStringsAsNumbersAsc(
        getUnique(
            rows.map((row) => row[headerIndex]).filter((value) => value.length)
        )
    )

export const getPrefixedValue = (value, prefix) => `${prefix}:${value}`

export const getNumericItems = (values, dimensionId) =>
    values.reduce((items, value) => {
        items[getPrefixedValue(value, dimensionId)] = {
            name: value,
        }
        return items
    }, {})

export const getNumericDimension = (values, dimensionId) => ({
    [dimensionId]: values.map((value) => getPrefixedValue(value, dimensionId)),
})

export const getNumericRows = (rows, headerIndex, dimensionId) => {
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

export const applyNumericHandler = (response, headerIndex) => {
    const dimensionId = response.headers[headerIndex].name
    const uniqueSortedValues = getUniqueSortedValues(response.rows, headerIndex)

    return {
        ...response,
        metaData: {
            ...response.metaData,
            items: {
                ...response.metaData.items,
                ...getNumericItems(uniqueSortedValues, dimensionId),
            },
            dimensions: {
                ...response.metaData.dimensions,
                ...getNumericDimension(uniqueSortedValues, dimensionId),
            },
        },
        rows: [...getNumericRows(response.rows, headerIndex, dimensionId)],
    }
}
