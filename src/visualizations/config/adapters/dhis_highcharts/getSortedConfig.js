import arrayPluck from 'd2-utilizr/lib/arrayPluck'
import arraySort from 'd2-utilizr/lib/arraySort'
import getStackedData from './getStackedData'
import { isTwoCategoryChartType } from '../../../../modules/visTypes'
import getTwoCategorySplitSerieData from './getTwoCategorySplitSerieData'

const sortOrderMap = new Map([
    [-1, 'ASC'],
    [1, 'DESC'],
])

function getIndexOrder(dataToBeSorted, layout) {
    const dataObjectsToBeSorted = dataToBeSorted.map((value, index) => ({
        index,
        value,
    }))

    const direction = sortOrderMap.get(layout.sortOrder)

    arraySort(dataObjectsToBeSorted, direction, 'value')

    return arrayPluck(dataObjectsToBeSorted, 'index')
}

function getTwoCategorySortedConfig(config, layout, stacked) {
    const series = config.series
    const sortedConfig = Object.assign({}, config)

    const stackedData = getStackedData(series, layout)
    const indexOrder = []

    // loop through serie groups
    sortedConfig.series = series.map((seriesObj, seriesIndex) => {
        if (seriesObj.custom.isTwoCategoryFakeSerie) {
            return seriesObj
        } else {
            seriesObj.custom.data = seriesObj.custom.data.map(
                (groupObj, groupIndex) => {
                    // sorting index computed on 1st serie data
                    if (seriesIndex === 0) {
                        indexOrder[groupIndex] = getIndexOrder(
                            stacked ? stackedData[groupIndex] : groupObj,
                            layout
                        )

                        // reorder 2nd category labels only once
                        // based on the 1st serie group ordering
                        const groupCategoryLabels =
                            config.xAxis[0].categories[groupIndex]

                        sortedConfig.xAxis[0].categories[
                            groupIndex
                        ] = groupCategoryLabels.map(
                            (value, index) =>
                                groupCategoryLabels[
                                    indexOrder[groupIndex][index]
                                ]
                        )
                    }

                    return groupObj.map(
                        (value, index) =>
                            groupObj[indexOrder[groupIndex][index]]
                    )
                }
            )

            seriesObj.data = getTwoCategorySplitSerieData(seriesObj.custom.data)

            return seriesObj
        }
    })

    return sortedConfig
}

function getDefaultSortedConfig(config, layout, stacked) {
    const categories = config.xAxis?.length && config.xAxis[0].categories
    const series = config.series
    const indexOrder = getIndexOrder(
        stacked ? getStackedData(series, layout) : series[0].data,
        layout
    )
    const sortedConfig = Object.assign({}, config)

    if (categories) {
        sortedConfig.xAxis[0].categories = indexOrder.map(
            index => categories[index]
        )
    }

    sortedConfig.series = series.map(seriesObj => ({
        ...seriesObj,
        data: seriesObj.data.map(
            (value, index) => seriesObj.data[indexOrder[index]]
        ),
    }))

    return sortedConfig
}

export default function (config, layout, stacked) {
    if (isTwoCategoryChartType(layout.type) && layout.rows.length > 1) {
        return getTwoCategorySortedConfig(config, layout, stacked)
    } else {
        return getDefaultSortedConfig(config, layout, stacked)
    }
}
