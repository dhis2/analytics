import getCumulativeData from './../getCumulativeData'
import getPie from './pie'
import getGauge from './gauge'
import getType, { isDualAxis, isYearOverYear } from '../type'
import { CHART_TYPE_PIE, CHART_TYPE_GAUGE } from '../type'
import { getFullIdAxisMap, getAxisIdsMap } from '../seriesItems'
import { generateColors } from '../../../../util/colors/gradientColorGenerator'
import { shouldHaveDualAxis } from '../layout'

const DEFAULT_ANIMATION_DURATION = 200

const HIGHCHARTS_TYPE_COLUMN = 'column'
const HIGHCHARTS_TYPE_BAR = 'bar'
const HIGHCHARTS_TYPE_PERCENT = 'percent'
const HIGHCHARTS_TYPE_NORMAL = 'normal'

const epiCurveTypes = [HIGHCHARTS_TYPE_COLUMN, HIGHCHARTS_TYPE_BAR]

function getAnimation(option, fallback) {
    return typeof option === 'number' ? option : fallback
}

function getColor(colors, index) {
    return colors[index] || getColor(colors, index - colors.length)
}

function getIdColorMap(series, layout, extraOptions) {
    if (shouldHaveDualAxis(layout)) {
        const axisIdsMap = getAxisIdsMap(layout.seriesItems, series)
        const theme = extraOptions.multiAxisTheme

        const colorsByAxis = Object.keys(axisIdsMap).reduce((map, axis) => {
            const numberOfIds = axisIdsMap[axis].length
            map[axis] = generateColors(
                theme[axis].startColor,
                theme[axis].endColor,
                numberOfIds,
                true
            )
            return map
        }, {})

        return Object.keys(colorsByAxis).reduce((map, axis) => {
            const colors = colorsByAxis[axis]
            const ids = axisIdsMap[axis]

            ids.forEach((id, index) => {
                map[id] = colors[index]
            })

            return map
        }, {})
    } else {
        const colors = extraOptions.colors

        return series.reduce((map, s, index) => {
            map[s.id] = getColor(colors, index)
            return map
        }, {})
    }
}

function getDefault(series, layout, isStacked, extraOptions) {
    const fullIdAxisMap = getFullIdAxisMap(layout.seriesItems, series)
    const idColorMap = getIdColorMap(series, layout, extraOptions)

    series.forEach((seriesObj, index) => {
        // show values
        if (layout.showValues || layout.showData) {
            seriesObj.dataLabels = {
                enabled: true,
            }
        }

        // stacked
        if (isStacked) {
            // DHIS2-1060: stacked charts can optionally be shown as 100% stacked charts
            seriesObj.stacking =
                layout.percentStackedValues === true
                    ? HIGHCHARTS_TYPE_PERCENT
                    : HIGHCHARTS_TYPE_NORMAL
        }

        // DHIS2-2101
        // show bar/column chart as EPI curve (basically remove spacing between bars/columns)
        if (layout.noSpaceBetweenColumns) {
            const seriesType = getType(layout.type).type

            if (arrayContains(epiCurveTypes, seriesType)) {
                seriesObj.pointPadding = 0
                seriesObj.groupPadding = 0
            }
        }

        // color
        seriesObj.color = isYearOverYear(layout.type)
            ? extraOptions.colors[index]
            : idColorMap[seriesObj.id]

        // axis number
        seriesObj.yAxis = isDualAxis(layout.type)
            ? fullIdAxisMap[seriesObj.id]
            : 0

        // custom names for "year over year" series
        if (extraOptions.yearlySeries) {
            seriesObj.name = extraOptions.yearlySeries[index]
        }
    })

    // DHIS2-701: use cumulative values
    if (layout.cumulativeValues === true) {
        series = getCumulativeData(series)
    }

    return series
}

export default function(series, store, layout, isStacked, extraOptions) {
    switch (layout.type) {
        case CHART_TYPE_PIE:
            series = getPie(
                series,
                store,
                layout,
                isStacked,
                extraOptions.colors
            )
            break
        case CHART_TYPE_GAUGE:
            series = getGauge(series, extraOptions.dashboard)
            break
        default:
            series = getDefault(series, layout, isStacked, extraOptions)
    }

    series.forEach(seriesObj => {
        // animation
        seriesObj.animation = {
            duration: getAnimation(
                extraOptions.animation,
                DEFAULT_ANIMATION_DURATION
            ),
        }
    })

    return series
}
