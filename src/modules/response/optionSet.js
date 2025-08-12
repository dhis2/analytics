import { NA_VALUE } from './response.js'

export const getOptionCodeIdMap = (optionIds, items) =>
    optionIds.reduce((map, optionId) => {
        map[items[optionId].code] = optionId
        return map
    }, {})

export const getOptionIdRows = (rows, optionCodeIdMap, headerIndex) => {
    let value
    let row

    return rows.map((r) => {
        value = r[headerIndex]

        if (value !== NA_VALUE) {
            row = [...r]
            row[headerIndex] = optionCodeIdMap[value]
            return row
        }

        return r
    })
}

export const applyOptionSetHandler = (response, headerIndex) => {
    const header = response.headers[headerIndex]
    const optionIds = response.metaData.dimensions[header.name]
    const optionCodeIdMap = getOptionCodeIdMap(
        optionIds,
        response.metaData.items
    )

    return {
        ...response,
        rows: getOptionIdRows(response.rows, optionCodeIdMap, headerIndex),
    }
}
