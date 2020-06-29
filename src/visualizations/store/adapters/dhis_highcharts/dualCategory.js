// 1 series, 2 categories
export default function(acc, series, categories, idValueMap, metaData) {
    console.log(
        'metaData',
        metaData,
        'categories',
        categories,
        'seriesIds',
        series,
        'idValueMap',
        idValueMap
    )

    series[0].forEach(seriesItemId => {
        const serieData = []

        categories[0].forEach(category1ItemId => {
            const groupData = []

            categories[1].forEach(category2ItemId => {
                const value = idValueMap.get(
                    `${seriesItemId}-${category1ItemId}-${category2ItemId}`
                )

                groupData.push(value === undefined ? null : parseFloat(value))
            })

            serieData.push(groupData)
        })

        // avoid a list of null values
        if (serieData.flat().every(e => e === serieData[0])) {
            serieData.length = 0
        }

        acc.push({
            id: seriesItemId,
            name: metaData.items[seriesItemId].name,
            data: serieData,
            xAxis: 0,
        })
    })

    acc.push({
        // with line the other column/bars are centered in the 2nd axis section
        type: 'line',
        // with null the fake series does not appear in the tooltip
        data: Array.from({ length: categories[0].length }, () => null),
        showInLegend: false,
        // assign the serie to the 2nd axis so the labels show
        xAxis: 1,
        // always hide the series' values
        dataLabels: {
            enabled: false,
        },
    })

    return acc
}
