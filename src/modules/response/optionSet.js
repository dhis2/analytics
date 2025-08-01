export const getOptionCodeIdMap = (optionIds, metaDataItems) => optionIds.reduce((map, optionId) => {
    map[metaDataItems[optionId].code] = optionId
    return map
}, {})

export const getOptionIdRows = (rows, optionCodeIdMap, headerIndex) => {
    let row
    return rows.map(r => {
        row = [...r]
        row[headerIndex] = optionCodeIdMap[row[headerIndex]]
        return row
    })
}

export const applyOptionSetHandler = (response, headerIndex) => {
    const header = response.headers[headerIndex]
    const optionIds = response.metaData.dimensions[header.name]
    const optionCodeIdMap = getOptionCodeIdMap(optionIds, response.metaData.items)

    return {
        ...response,
        rows: getOptionIdRows(response.rows, optionCodeIdMap, headerIndex)
    }
}