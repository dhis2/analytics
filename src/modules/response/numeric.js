import i18n from '@dhis2/d2-i18n'

export const getUnique = (array) => [...new Set(array)]

export const sortStringsAsNumbersAsc = (arr) => {
    return arr.slice().sort((a, b) => {
        if (a === '' && b === '') {
            return 0
        }
        if (a === '') {
            return 1
        }
        if (b === '') {
            return -1
        }
        return Number(a) - Number(b)
    })
}

export const getPrefixedValue = (value, prefix) =>
    value !== '' ? `${prefix}:${value}` : value

export const getNumericItems = (values, dimensionId) =>
    values.reduce((items, value) => {
        items[getPrefixedValue(value, dimensionId)] = {
            name: value || i18n.t('N/A'),
        }
        return items
    }, {})

export const getNumericDimension = (values, dimensionId) => ({
    [dimensionId]: values.map((value) => getPrefixedValue(value, dimensionId)),
})

export const getNumericRows = (rows, headerIndex, dimensionId) => {
    let row

    return rows.map((r) => {
        row = [...r]
        row[headerIndex] = getPrefixedValue(row[headerIndex], dimensionId)
        return row
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
