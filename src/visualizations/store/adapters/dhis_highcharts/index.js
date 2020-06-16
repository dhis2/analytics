import arrayContains from 'd2-utilizr/lib/arrayContains'
import arrayUnique from 'd2-utilizr/lib/arrayUnique'

import getYearOnYear from './yearOnYear'
import getPie from './pie'
import getGauge from './gauge'
import {
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_COLUMN,
    VIS_TYPE_PIE,
    VIS_TYPE_GAUGE,
    VIS_TYPE_LINE,
} from '../../../../modules/visTypes'

const VALUE_ID = 'value'

function arrayNullsOnly(array) {
    return arrayContains(array, null) && arrayUnique(array).length === 1
}

function getHeaderIdIndexMap(headers) {
    const map = new Map()

    headers.forEach((header, index) => {
        map.set(header.name, index)
    })
    console.log('headers map', map)
    return map
}

function getPrefixedId(row, header) {
    return (header.isPrefix ? header.name + '_' : '') + row[header.index]
}

function getIdValueMap(rows, seriesHeader, categoryHeader, valueIndex) {
    const map = new Map()

    let key
    let value

    rows.forEach(row => {
        key = [
            ...(seriesHeader ? [getPrefixedId(row, seriesHeader)] : []),
            ...(categoryHeader ? [getPrefixedId(row, categoryHeader)] : []),
        ].join('-')

        value = row[valueIndex]

        map.set(key, value)
    })

    return map
}

// XXX
function getIdValueMap2(rows, valueIndex) {
    const map = new Map()

    let key
    let value

    rows.forEach(r => {
        const row = r.slice()

        value = row.splice(valueIndex, 1).pop()

        key = row.join('-')

        map.set(key, value)
    })

    return map
}

function getMultiCategory(
    acc,
    seriesId,
    categoryIds,
    idValueMap,
    metaData,
    headers,
    engine
) {
    console.log('id value map', idValueMap)

    const dimensionLookup = engine.dimensionLookup

    const seriesItems = dimensionLookup.columns[0].items
    /*
    const multiCategory = dimensionLookup.rows.length > 1

    //const seriesItemsIds = metaData.dimensions[seriesId]
    /*
    const headerIdIndexMap = getHeaderIdIndexMap(headers)
    const categoryIndexes = categoryIds.map(categoryId =>
        headerIdIndexMap.get(categoryId)
    )
    console.log('LEFT HERE cat indexes', categoryIndexes)
*/
    /*    if (categoryIds.length > 1) {
        categoryIds.reverse()
    }*/
    /*
    const categories = dimensionLookup.rows

    const categoryMatrix = categories.reduce(
        (acc, { dimension: categoryId, items: categoryItems }) => {
            const categoryIndex = dimensionLookup.headerDimensions.findIndex(
                header => header.dimension === categoryId
            )

            acc[categoryIndex] = categoryItems.map(({ uid: id, name }) => ({
                id,
                name,
            }))

            return acc
        },
        []
    )

    console.log('matrix1', categoryMatrix)

    const category1 = dimensionLookup.rows[0]
    const category2 = dimensionLookup.rows[1]

    const categoryIndexes = categories.reduce(
        (acc, { dimension: categoryId }) => {
            const index = dimensionLookup.headerDimensions.findIndex(
                header => header.dimension === categoryId
            )

            acc.push(index)

            return acc
        },
        []
    )

    console.log('category indexes', categoryIndexes)

    const idValueMapKey = (category1Item, category2Item) => {
        const category1Index = dimensionLookup.headerDimensions.findIndex(
            header => header.dimension === category1.dimension
        )
        const category2Index = dimensionLookup.headerDimensions.findIndex(
            header => header.dimension === category2.dimension
        )

        const order = [
            [category1Item, category1Index],
            [category2Item, category2Index],
        ]
        order.sort((a, b) => a[1] - b[1])

        return order.map(categoryItem => categoryItem[0].uid).join('-')
    }

    const matrixItems = []

    category1.items.map(category1Item => {
        if (multiCategory) {
            dimensionLookup.rows[1].items.map(category2Item =>
                matrixItems.push({
                    key: idValueMapKey(category1Item, category2Item),
                    name: category1Item.name,
                })
            )
        } else {
            console.log('NO MULTICATEGORY matrix')
            matrixItems.push([
                {
                    key: category1Item.uid,
                    name: category1Item.name,
                },
            ])
        }
    })
*/
    const keys = []
    const tmp = []
    const dimensionsCount =
        dimensionLookup.columnHeaders.length + dimensionLookup.rowHeaders.length
    const extractLookupKey = (index = 0) => {
        dimensionLookup.headerDimensions[index].itemIds.forEach(itemId => {
            tmp.splice(index)
            tmp.push(itemId)

            if (dimensionsCount - 1 > index) {
                extractLookupKey(index + 1)
            } else {
                keys.push(tmp.join('-'))
            }
        })
    }

    extractLookupKey()
    console.log('keys', keys)

    const valueIndex = dimensionLookup.dataHeaders.value

    const fillBlanks = array => {
        const output = []

        for (let i = 0; i < array.length; i++) {
            output[i] = array[i] === undefined ? [null] : array[i]
        }

        return output
    }

    const data = fillBlanks(engine.data)

    data.reduce((series, rowData) => {
        rowData.forEach((data, serieIndex) => {
            if (!series[serieIndex]) {
                series[serieIndex] = {
                    id: seriesItems[serieIndex].uid,
                    name: seriesItems[serieIndex].name,
                    data: [],
                }
            }

            series[serieIndex].data.push(
                data === null ? null : Number(data[valueIndex])
            )
        })

        return series
    }, []).map(serie => acc.push(serie))

    /*
    seriesItems.forEach(({ uid: seriesItemId, name: seriesItemName }) => {
        //        categoryMatrix.forEach(categoryMatrixItem => {
        const serieData = []
        let serieId

        //categoryIds.forEach(categoryId => {
        //categoryMatrixItem.forEach(
        matrixItems.forEach(({ key, name }) => {
            const value = idValueMap.get(`${seriesItemId}-${key}`)

            // DHIS2-1261: 0 is a valid value
            // undefined value means the key was not found within the rows
            // in that case null is returned as value in the serie
            // this is to keep the correct indexes for the values within the serie array
            serieData.push(value === undefined ? null : parseFloat(value))

            serieId = serieId || `${seriesItemId}-${key}`
        })

        // if the whole serie has no data, do not return a list of null values
        // otherwise Highcharts thinks that data is available and does not show the "No data to display" message
        if (arrayNullsOnly(serieData)) {
            serieData.length = 0
        }

        acc.push({
            id: serieId,
            name: seriesItemName,
            data: serieData,
        })
        //      })
    })
*/
    return acc
}

function getDefault(
    acc,
    seriesId,
    categoryIds,
    idValueMap,
    metaData,
    headers,
    engine
) {
    // multi category
    if (engine.dimensionLookup.rows.length > 1) {
        return getMultiCategory(
            acc,
            seriesId,
            categoryIds,
            idValueMap,
            metaData,
            headers,
            engine
        )
    }

    const seriesItems = metaData.dimensions[seriesId].map(
        id => metaData.items[id]
    )
    const categoryItemsIds = metaData.dimensions[categoryIds[0]]

    seriesItems.forEach(({ uid: seriesItemId, name: seriesItemName }) => {
        const serieData = []

        categoryItemsIds.forEach(categoryItemId => {
            const value = idValueMap.get(`${seriesItemId}-${categoryItemId}`)

            // DHIS2-1261: 0 is a valid value
            // undefined value means the key was not found within the rows
            // in that case null is returned as value in the serie
            // this is to keep the correct indexes for the values within the serie array
            serieData.push(value === undefined ? null : parseFloat(value))
        })

        // if the whole serie has no data, do not return a list of null values
        // otherwise Highcharts thinks that data is available and does not show the "No data to display" message
        if (arrayNullsOnly(serieData)) {
            serieData.length = 0
        }

        acc.push({
            id: seriesItemId,
            name: seriesItemName,
            data: serieData,
        })
    })

    return acc
}

function getSeriesFunction(type) {
    switch (type) {
        case VIS_TYPE_PIE:
            return getPie
        case VIS_TYPE_GAUGE:
            return getGauge
        case VIS_TYPE_YEAR_OVER_YEAR_COLUMN:
        case VIS_TYPE_YEAR_OVER_YEAR_LINE:
            return getYearOnYear
        default:
            return getDefault
    }
}

export default function({ type, data, seriesId, categoryIds, engine }) {
    const seriesFunction = getSeriesFunction(type)

    return data.reduce((acc, res) => {
        const headers = res.headers
        const metaData = res.metaData
        const rows = res.rows
        const headerIdIndexMap = getHeaderIdIndexMap(headers)

        const valueIndex = headerIdIndexMap.get(VALUE_ID)
        /*
        const seriesIndex = headerIdIndexMap.get(seriesId)
        const categoryIndexes = categoryIds.map(categoryId =>
            headerIdIndexMap.get(categoryId)
        )

        const seriesHeader = headers[seriesIndex]
        const categoryHeader = headers[categoryIndex]

        const idValueMap = getIdValueMap(
            rows,
            seriesHeader,
            categoryHeader,
            valueIndex
        )*/
        const idValueMap = getIdValueMap2(rows, valueIndex)

        console.log('lookup map', idValueMap)

        //const seriesIds = metaData.dimensions[seriesId]
        //const categoryIds = metaData.dimensions[categoryId]
        /*
        categoryIds.sort(
            (a, b) => headerIdIndexMap.get(a) - headerIdIndexMap.get(b)
        )
*/
        seriesFunction(
            acc,
            seriesId,
            categoryIds,
            idValueMap,
            metaData,
            headers,
            engine
        )

        return acc
    }, [])
}
