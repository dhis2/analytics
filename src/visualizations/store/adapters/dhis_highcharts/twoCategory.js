import getTwoCategorySplitSerieData from '../../../config/adapters/dhis_highcharts/getTwoCategorySplitSerieData'

// 1 series, 2 categories
export default function (acc, series, categories, idValueMap, metaData) {
    series[0].forEach((seriesItemId) => {
        const groupedData = []

        categories[0].forEach((category1ItemId) => {
            const groupData = []

            categories[1].forEach((category2ItemId) => {
                const value = idValueMap.get(
                    `${seriesItemId}-${category1ItemId}-${category2ItemId}`
                )

                groupData.push(value === undefined ? null : parseFloat(value))
            })

            groupedData.push(groupData)
        })

        const serieData = getTwoCategorySplitSerieData(groupedData)

        // avoid a list of null values
        if (serieData.every((e) => e === null)) {
            serieData.length = 0
            groupedData.length = 0
        }

        acc.push({
            id: seriesItemId,
            name: metaData.items[seriesItemId].name,
            data: serieData,
            custom: {
                data: groupedData,
            },
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
        custom: {
            isTwoCategoryFakeSerie: true,
        },
    })

    return acc
}
