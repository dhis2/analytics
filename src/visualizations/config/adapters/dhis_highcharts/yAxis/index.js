// import i18n from '../../../../../locales/index.js'
import arrayClean from 'd2-utilizr/lib/arrayClean'
import objectClean from 'd2-utilizr/lib/objectClean'

import getAxisTitle from '../getAxisTitle'
import getGauge from './gauge'
import {
    isStacked,
    VIS_TYPE_GAUGE,
    VIS_TYPE_SCATTER,
} from '../../../../../modules/visTypes'
import { getAxisStringFromId } from '../../../../util/axisId'
import {
    FONT_STYLE_VERTICAL_AXIS_TITLE,
    mergeFontStyleWithDefault,
    TEXT_ALIGN_RIGHT,
} from '../../../../../modules/fontStyle'
import getSteps from '../getSteps'
import { getAxis } from '../../../../util/axes'
import {
    getGridLineColor,
    getLabels,
    getMaxValue,
    getMinValue,
    getRegressionLine,
} from '../axis'
import { getAxisIdsMap } from '../customAxes'

const AXIS_TYPE_RANGE = 'RANGE'

function getDefault(layout, series, extraOptions) {
    const axes = []
    const dataValues = series?.map(item => item.data).flat()
    const layoutAxes = []
    if (layout.type === VIS_TYPE_SCATTER) {
        layoutAxes.push(getAxis(layout.axes, AXIS_TYPE_RANGE, 0))
    } else {
        const axisIdsMap = getAxisIdsMap(layout.series, series)
        const axisIds = [...new Set(Object.keys(axisIdsMap))].sort(
            (a, b) => a - b
        )
        axisIds.forEach(id =>
            layoutAxes.push(getAxis(layout.axes, AXIS_TYPE_RANGE, Number(id)))
        )
    }

    let extremeObj

    if (
        layout.type === VIS_TYPE_SCATTER &&
        extraOptions.outlierHelper?.extremeLines
    ) {
        extremeObj = extraOptions.outlierHelper.extremeLines[1]
    }

    layoutAxes.forEach(axis => {
        axes.push(
            objectClean({
                min: getMinValue(
                    axis.minValue,
                    dataValues,
                    extraOptions.outlierHelper?.yAxisMin
                ),
                max: getMaxValue(
                    axis.maxValue,
                    dataValues,
                    extraOptions.outlierHelper?.yAxisMax
                ),
                tickAmount: getSteps(axis),
                title: getAxisTitle(
                    axis.title?.text,
                    mergeFontStyleWithDefault(
                        axis.title?.fontStyle,
                        FONT_STYLE_VERTICAL_AXIS_TITLE
                    ),
                    FONT_STYLE_VERTICAL_AXIS_TITLE,
                    layout.type
                ),
                plotLines: arrayClean([
                    getRegressionLine(axis.targetLine, layout.type),
                    getRegressionLine(axis.baseLine, layout.type),
                    extremeObj &&
                        getRegressionLine({
                            value: extremeObj.value,
                            color: '#a9adb3',
                            width: 1,
                            dashStyle: 'Dash',
                            title: {
                                text: extremeObj.name,
                                fontStyle: {
                                    textAlign: TEXT_ALIGN_RIGHT,
                                },
                            },
                        }),
                ]),
                gridLineColor: getGridLineColor(),
                labels: getLabels(axis),
                id: getAxisStringFromId(axis.index),

                // DHIS2-649: put first serie at the bottom of the stack
                // in this way the legend sequence matches the serie sequence
                reversedStacks: isStacked(layout.type) ? false : true,
                opposite: !!(axis.index % 2),
            })
        )
    })
    // }

    return axes
}

export default function (layout, series, extraOptions) {
    let yAxis
    switch (layout.type) {
        case VIS_TYPE_GAUGE:
            yAxis = getGauge(layout, series, extraOptions.legendSets[0])
            break
        default:
            yAxis = getDefault(layout, series, extraOptions)
    }

    return yAxis
}
