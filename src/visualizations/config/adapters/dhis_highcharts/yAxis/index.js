import i18n from '@dhis2/d2-i18n'
import arrayClean from 'd2-utilizr/lib/arrayClean'
import objectClean from 'd2-utilizr/lib/objectClean'

import getAxisTitle from '../getAxisTitle'
import getGauge from './gauge'
import {
    isStacked,
    VIS_TYPE_GAUGE,
    isDualAxisType,
    VIS_TYPE_SCATTER,
} from '../../../../../modules/visTypes'
import { hasCustomAxes } from '../../../../../modules/axis'
import { getAxisIdsMap } from '../customAxes'
import { getAxisStringFromId } from '../../../../util/axisId'
import {
    FONT_STYLE_VERTICAL_AXIS_TITLE,
    mergeFontStyleWithDefault,
    TEXT_ALIGN_RIGHT,
} from '../../../../../modules/fontStyle'
import { axisHasRelativeItems } from '../../../../../modules/layout/axisHasRelativeItems'
import getSteps from '../getSteps'
import { getAxis } from '../../../../util/axes'
import {
    getGridLineColor,
    getLabels,
    getMaxValue,
    getMinValue,
    getRegressionLine,
} from '../axis'

const AXIS_TYPE = 'RANGE'
const AXIS_INDEX = 0

function getMultipleAxes(theme, axes) {
    const axisObjects = []
    axes.forEach(axisId => {
        const id = Number(axisId)
        axisObjects.push({
            title: {
                text: i18n.t('Axis {{axisId}}', {
                    axisId: id + 1,
                }),
                style: {
                    color: theme[id].mainColor,
                    'font-weight': 700,
                },
            },
            id: getAxisStringFromId(id),
            opposite: !!(id % 2),
        })
    })
    return axisObjects
}

function getDefault(layout, series, extraOptions) {
    const axes = []
    const filteredSeries = layout.series?.filter(layoutSeriesItem =>
        series.some(
            seriesItem => seriesItem.id === layoutSeriesItem.dimensionItem
        )
    )
    const dataValues = series?.map(item => item.data).flat()
    if (
        isDualAxisType(layout.type) &&
        hasCustomAxes(filteredSeries) &&
        !axisHasRelativeItems(layout.columns)
    ) {
        const axisIdsMap = getAxisIdsMap(layout.series, series)
        axes.push(
            ...getMultipleAxes(
                extraOptions.multiAxisTheme,
                [...new Set(Object.keys(axisIdsMap))].sort((a, b) => a - b)
            )
        )
    } else {
        const axis = getAxis(layout.axes, AXIS_TYPE, AXIS_INDEX)
        let extremeObj

        if (
            layout.type === VIS_TYPE_SCATTER &&
            extraOptions.outlierHelper?.extremeLines
        ) {
            extremeObj = extraOptions.outlierHelper.extremeLines[1]
        }

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
                id: getAxisStringFromId(0),

                // DHIS2-649: put first serie at the bottom of the stack
                // in this way the legend sequence matches the serie sequence
                reversedStacks: isStacked(layout.type) ? false : true,
            })
        )
    }

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
