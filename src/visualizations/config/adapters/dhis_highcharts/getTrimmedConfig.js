import arrayContains from 'd2-utilizr/lib/arrayContains'
import arrayUnique from 'd2-utilizr/lib/arrayUnique'
import { isTwoCategoryChartType } from '../../../../modules/visTypes.js'
import getTwoCategorySplitSerieData from './getTwoCategorySplitSerieData.js'

function arrayCleanUndefined(array) {
    return array.filter((item) => item !== undefined)
}

function arrayNullsOnly(array) {
    return arrayContains(array, null) && arrayUnique(array).length === 1
}

function getEmptySeriesIndexes(series) {
    const emptyIndexes = []
    let seriesValues

    series[0].data.forEach((value, index) => {
        seriesValues = []

        series.forEach(({ data }) => {
            // handle undefined values due to empty (or shorter) serie data
            // preserve 0 as valid value
            seriesValues.push(data[index] === undefined ? null : data[index])
        })

        if (arrayNullsOnly(seriesValues)) {
            emptyIndexes.push(index)
        }
    })

    return emptyIndexes
}

function getFirstLastValueIndexes(series) {
    let firstValueIndex = undefined
    let lastValueIndex = 0
    let data
    let i

    series.forEach((seriesObj) => {
        // make a copy of the array so we can reverse it
        // without affecting the original
        data = seriesObj.data.slice()

        i = data.findIndex((value) => value !== undefined && value !== null)

        if (i > -1) {
            firstValueIndex =
                firstValueIndex !== undefined ? Math.min(firstValueIndex, i) : i
        }

        i = data
            .reverse()
            .findIndex((value) => value !== undefined && value !== null)

        if (i > -1) {
            lastValueIndex = Math.max(lastValueIndex, data.length - 1 - i)
        }
    })

    return { firstValueIndex, lastValueIndex }
}

function cleanData(
    data,
    emptySeriesIndexes,
    firstValueIndex,
    lastValueIndex,
    hideEmptyRowItems
) {
    let cleanedData

    switch (hideEmptyRowItems) {
        case 'ALL':
            cleanedData = arrayCleanUndefined(
                data.map((value, index) =>
                    arrayContains(emptySeriesIndexes, index) ? undefined : value
                )
            )
            break
        case 'BEFORE_FIRST':
            cleanedData = data.slice(firstValueIndex)
            break
        case 'AFTER_LAST':
            cleanedData = data.slice(0, lastValueIndex + 1)
            break
        case 'BEFORE_FIRST_AFTER_LAST':
            cleanedData = data.slice(firstValueIndex, lastValueIndex + 1)
            break
        default:
            cleanedData = data
    }

    return cleanedData
}

export default function (config, layout) {
    if (isTwoCategoryChartType(layout.type) && layout.rows.length > 1) {
        return getTwoCategoryTrimmedConfig(config, layout)
    } else {
        return getDefaultTrimmedConfig(config, layout)
    }
}

function getEmptySeriesGroupIndexes(series) {
    const emptyGroupIndexes = []

    series[0].custom.data.forEach((groupObj, groupIndex) => {
        const seriesGroupValues = []

        groupObj.forEach((_, index) =>
            series.forEach((seriesObj) =>
                seriesGroupValues.push(seriesObj.custom.data[groupIndex][index])
            )
        )

        if (arrayNullsOnly(seriesGroupValues)) {
            emptyGroupIndexes.push(groupIndex)
        }
    })

    return emptyGroupIndexes
}

function getFirstLastGroupWithValuesIndexes(series) {
    let firstGroupWithValuesIndex = undefined
    let lastGroupWithValuesIndex = 0

    series.forEach((seriesObj) => {
        // make a copy of the groups array so we can reverse it
        // without affecting the original
        const groups = seriesObj.custom.data.slice()

        groups.forEach((groupObj, groupIndex) => {
            if (
                groupObj.some((value) => value !== undefined && value !== null)
            ) {
                firstGroupWithValuesIndex =
                    firstGroupWithValuesIndex !== undefined
                        ? Math.min(firstGroupWithValuesIndex, groupIndex)
                        : groupIndex
            }
        })

        groups.reverse().forEach((groupObj, groupIndex) => {
            if (
                groupObj.some((value) => value !== undefined && value !== null)
            ) {
                lastGroupWithValuesIndex = Math.max(
                    lastGroupWithValuesIndex,
                    groups.length - 1 - groupIndex
                )
            }
        })
    })

    return { firstGroupWithValuesIndex, lastGroupWithValuesIndex }
}

function getTwoCategoryTrimmedConfig(config, layout) {
    const filteredSeries = config.series.filter(
        (serieObj) => !serieObj.custom.isTwoCategoryFakeSerie
    )
    const emptyGroupIndexes = getEmptySeriesGroupIndexes(filteredSeries)

    if (emptyGroupIndexes.length && config.xAxis && config.series) {
        const { firstGroupWithValuesIndex, lastGroupWithValuesIndex } =
            getFirstLastGroupWithValuesIndexes(filteredSeries)

        const trimmedSeries = config.series.map((seriesObj) => {
            if (seriesObj.custom.isTwoCategoryFakeSerie) {
                seriesObj.data = cleanData(
                    seriesObj.data,
                    emptyGroupIndexes,
                    firstGroupWithValuesIndex,
                    lastGroupWithValuesIndex,
                    layout.hideEmptyRowItems
                )
            } else {
                seriesObj.custom.data = cleanData(
                    seriesObj.custom.data,
                    emptyGroupIndexes,
                    firstGroupWithValuesIndex,
                    lastGroupWithValuesIndex,
                    layout.hideEmptyRowItems
                )

                seriesObj.data = getTwoCategorySplitSerieData(
                    seriesObj.custom.data
                )
            }

            return seriesObj
        })

        const trimmedXAxis = config.xAxis.map((xAxis) => {
            xAxis.categories = cleanData(
                xAxis.categories,
                emptyGroupIndexes,
                firstGroupWithValuesIndex,
                lastGroupWithValuesIndex,
                layout.hideEmptyRowItems
            )

            return xAxis
        })

        return Object.assign({}, config, {
            series: trimmedSeries,
            xAxis: trimmedXAxis,
        })
    } else {
        return config
    }
}

function getDefaultTrimmedConfig(config, layout) {
    const emptySeriesIndexes = getEmptySeriesIndexes(config.series)

    if (emptySeriesIndexes.length && config.xAxis && config.series) {
        const { firstValueIndex, lastValueIndex } = getFirstLastValueIndexes(
            config.series
        )
        const trimmedSeries = config.series.map((seriesObj) => ({
            ...seriesObj,
            data: cleanData(
                seriesObj.data,
                emptySeriesIndexes,
                firstValueIndex,
                lastValueIndex,
                layout.hideEmptyRowItems
            ),
        }))

        const trimmedXAxis = [
            {
                ...config.xAxis,
                categories: cleanData(
                    config.xAxis[0].categories,
                    emptySeriesIndexes,
                    firstValueIndex,
                    lastValueIndex,
                    layout.hideEmptyRowItems
                ),
            },
        ]

        return Object.assign({}, config, {
            series: trimmedSeries,
            xAxis: trimmedXAxis,
        })
    } else {
        return config
    }
}
