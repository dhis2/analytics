export const getUnique = (array) => [...new Set(array)]

export const sortStringsAsNumbersAsc = (arr) => {
    return arr.slice().sort((a, b) => Number(a) - Number(b))
}

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

        if (value !== '') {
            row = [...r]
            row[headerIndex] = getPrefixedValue(value, dimensionId)
            return row
        }

        return r
    })
}

export const applyNumericHandler = (response, headerIndex) => {
    const uniqueSortedValues = sortStringsAsNumbersAsc(
        getUnique(response.rows.map((r) => r[headerIndex]))
    )

    const dimensionId = response.headers[headerIndex].name

    return {
        ...response,
        metaData: {
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
