import { NA_VALUE, PREFIX_SEPARATOR } from './response.js'

export const getUnique = (array) => [...new Set(array)]

export const sortValuesAsc = (arr) => {
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
        if (Number.isFinite(a) && Number.isFinite(b)) {
            return Number(a) - Number(b)
        } else {
            console.log('VALUES', typeof a, a, typeof b, b)
            return a.localeCompare(b)
        }
    })
}

export const getUniqueSortedValues = (rows, headerIndex) =>
    sortValuesAsc(
        getUnique(
            rows.map((row) => row[headerIndex]).filter((value) => value.length)
        )
    )

export const getPrefixedValue = (value, prefix) =>
    `${prefix}${PREFIX_SEPARATOR}${value}`

export const getItems = (values, dimensionId, itemFormatter) =>
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
    const dimensionId = response.headers[headerIndex].name

    const uniqueSortedValues = getUniqueSortedValues(response.rows, headerIndex)

    if (dimensionId === 'A03MvHHogjR.bx6fsa0t90x') {
        console.log(response, headerIndex, uniqueSortedValues)
    }

    return {
        ...response,
        metaData: {
            ...response.metaData,
            items: {
                ...response.metaData.items,
                ...getItems(uniqueSortedValues, dimensionId, itemFormatter),
            },
            dimensions: {
                ...response.metaData.dimensions,
                ...getDimensions(uniqueSortedValues, dimensionId),
            },
        },
        rows: [...getRows(response.rows, headerIndex, dimensionId)],
    }
}
