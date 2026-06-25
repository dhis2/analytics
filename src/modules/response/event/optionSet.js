import { D2__NOVALUE, NO_VALUE, NO_VALUE_ITEM } from './response.js'

export const getOptionCodeIdMap = (optionIds, items) =>
    optionIds.reduce((map, optionId) => {
        if (items[optionId]?.code) {
            map[items[optionId].code] = optionId
        }
        return map
    }, {})

export const getOptionIdRows = (rows, optionCodeIdMap, headerIndex) => {
    let value
    let row

    return rows.map((r) => {
        value = r[headerIndex]

        if (value !== NO_VALUE) {
            row = [...r]
            row[headerIndex] = optionCodeIdMap[value]
            return row
        }

        return r
    })
}

// Replace codes with id in rows
// If D2__NOVALUE, replace with NO_VALUE and add item
export const applyOptionSetHandler = (response, headerIndex) => {
    const header = response.headers[headerIndex]
    const optionCodeIdMap = getOptionCodeIdMap(
        response.metaData.dimensions[header.name],
        response.metaData.items
    )

    const res = {
        ...response,
        rows: getOptionIdRows(response.rows, optionCodeIdMap, headerIndex),
    }

    if (res.metaData.dimensions[header.name].includes(D2__NOVALUE)) {
        res.metaData.dimensions[header.name] = res.metaData.dimensions[header.name]
            .map(d => d === D2__NOVALUE ? NO_VALUE : d)
        res.metaData.items = {
            ...res.metaData.items,
            [NO_VALUE]: NO_VALUE_ITEM,
        }
    }

    return res
}
