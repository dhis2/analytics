import arrayContains from 'd2-utilizr/lib/arrayContains'
import arrayUnique from 'd2-utilizr/lib/arrayUnique'

import getYearOnYear from './yearOnYear'
import getPie from './pie'
import getGauge from './gauge'
import {
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_PIE,
    VIS_TYPE_GAUGE,
} from '../../../config/adapters/dhis_highcharts/type'

const VALUE_ID = 'value'

function arrayNullsOnly(array) {
    return arrayContains(array, null) && arrayUnique(array).length === 1
}

function getHeaderIdIndexMap(headers) {
    const map = new Map()

    headers.forEach((header, index) => {
        map.set(header.name, index)
    })

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

function getDefault(acc, seriesIds, categoryIds, idValueMap, metaData) {
    seriesIds.forEach(seriesId => {
        const serieData = []
        const serieLabel = metaData.items[seriesId].name

        categoryIds.forEach(categoryId => {
            const value = idValueMap.get(`${seriesId}-${categoryId}`)

            // DHIS2-1261: 0 is a valid value
            // undefined value means the key was not found within the rows
            // in that case null is returned as value in the serie
            // this is to keep the correct indexes for the values within the serie array
            serieData.push(value == undefined ? null : parseFloat(value))

            // if the whole serie has no data, do not return a list of null values
            // otherwise Highcharts thinks that data is available and does not show the "No data to display" message
            if (arrayNullsOnly(serieData)) {
                serieData.length = 0
            }
        })

        acc.push({
            id: seriesId,
            name: metaData.items[seriesId].name,
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

export default function({ type, data, seriesId, categoryId }) {
    const seriesFunction = getSeriesFunction(type)

    return data.reduce((acc, res) => {
        const headers = res.headers
        const metaData = res.metaData
        const rows = res.rows
        const headerIdIndexMap = getHeaderIdIndexMap(headers)

        const seriesIndex = headerIdIndexMap.get(seriesId)
        const categoryIndex = headerIdIndexMap.get(categoryId)
        const valueIndex = headerIdIndexMap.get(VALUE_ID)

        const seriesHeader = headers[seriesIndex]
        const categoryHeader = headers[categoryIndex]

        const idValueMap = getIdValueMap(
            rows,
            seriesHeader,
            categoryHeader,
            valueIndex
        )

        const seriesIds = metaData.dimensions[seriesId]
        const categoryIds = metaData.dimensions[categoryId]

        seriesFunction(acc, seriesIds, categoryIds, idValueMap, metaData)

        return acc
    }, [])
}
