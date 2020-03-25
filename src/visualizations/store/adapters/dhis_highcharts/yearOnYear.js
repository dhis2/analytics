export default function(acc, seriesIds, categoryIds, idValueMap, metaData) {
    const serieData = []
    let serieLabel

    seriesIds.forEach(seriesId => {
        serieLabel = metaData.items[seriesId].name

        categoryIds.forEach(categoryId => {
            const value = idValueMap.get(`${seriesId}-${categoryId}`)

            // DHIS2-1261: 0 is a valid value
            // undefined value means the key was not found within the rows
            // in that case null is returned as value in the serie for highcharts
            serieData.push(value === undefined ? null : parseFloat(value))
        })
    })

    acc.push({
        name: serieLabel,
        data: serieData,
    })

    return acc
}
