import arrayContains from 'd2-utilizr/lib/arrayContains'
import arrayUnique from 'd2-utilizr/lib/arrayUnique'
import {
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_PIE,
    VIS_TYPE_GAUGE,
    isTwoCategoryChartType,
} from '../../../../modules/visTypes'
import getGauge from './gauge'
import getPie from './pie'
import getTwoCategory from './twoCategory'
import getYearOnYear from './yearOnYear'

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

function getIdValueMap(rows, seriesHeader, categoryHeaders, valueIndex) {
    const map = new Map()

    let key
    let value

    rows.forEach((row) => {
        key = [
            ...(seriesHeader ? [getPrefixedId(row, seriesHeader)] : []),
            ...(categoryHeaders
                ? categoryHeaders.map((categoryHeader) =>
                      getPrefixedId(row, categoryHeader)
                  )
                : []),
        ].join('-')

        value = row[valueIndex]

        map.set(key, value)
    })

    return map
}

// 1 series, 1 category
function getDefault(acc, series, categories, idValueMap, metaData) {
    series[0].forEach((serieItemId) => {
        const serieData = []

        categories[0].forEach((categoryItemId) => {
            const value = idValueMap.get(`${serieItemId}-${categoryItemId}`)

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
            id: serieItemId,
            name: metaData.items[serieItemId].name,
            data: serieData,
        })
    })

    return acc
}

function getSeriesFunction(type, categoryIds) {
    if (isTwoCategoryChartType(type) && categoryIds.length === 2) {
        return getTwoCategory
    }

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

export default function ({ type, data, seriesId, categoryIds, extraOptions }) {
    categoryIds = categoryIds || []

    const seriesFunction = getSeriesFunction(type, categoryIds)

    return data.reduce((acc, res) => {
        const headers = res.headers
        const metaData = res.metaData
        const rows = res.rows
        const headerIdIndexMap = getHeaderIdIndexMap(headers)

        const seriesHeader = headers[headerIdIndexMap.get(seriesId)]
        const categoryHeaders = categoryIds.map(
            (categoryId) => headers[headerIdIndexMap.get(categoryId)]
        )

        const idValueMap = getIdValueMap(
            rows,
            seriesHeader,
            categoryHeaders,
            headerIdIndexMap.get(VALUE_ID)
        )

        const series = [metaData.dimensions[seriesId]]
        const categories = categoryIds.map((id) => metaData.dimensions[id])

        seriesFunction(
            acc,
            series,
            categories,
            idValueMap,
            metaData,
            extraOptions
        )

        return acc
    }, [])
}
