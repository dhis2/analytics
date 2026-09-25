import { D2__NOVALUE, NA_VALUE } from './response.js'

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

    response.metaData.dimensions[header.name] =
        response.metaData.dimensions[header.name].map((id) =>
            id === D2__NOVALUE ? NA_VALUE : id
        )

    const optionCodeIdMap = getOptionCodeIdMap(
        response.metaData.dimensions[header.name],
        response.metaData.items
    )

    return {
        ...response,
        rows: getOptionIdRows(response.rows, optionCodeIdMap, headerIndex),
    }
}
