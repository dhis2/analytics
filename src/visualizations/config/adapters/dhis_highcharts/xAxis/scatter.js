import arrayClean from 'd2-utilizr/lib/arrayClean'
import objectClean from 'd2-utilizr/lib/objectClean'

import getAxisTitle from '../getAxisTitle'
import { getAxisStringFromId } from '../../../../util/axisId'
import {
    FONT_STYLE_VERTICAL_AXIS_TITLE,
    mergeFontStyleWithDefault,
} from '../../../../../modules/fontStyle'
import getSteps from '../getSteps'
import { getAxis } from '../../../../util/axes'
import {
    getGridLineColor,
    getLabels,
    getMinValue,
    getMaxValue,
    getRegressionLine,
} from '../axis'
import { PROP_EXTREME_LINES } from '../../../../../modules/outliers'

const AXIS_TYPE = 'RANGE'
const AXIS_INDEX = 1

export default function (layout, series, extraOptions) {
    const dataValues = series?.map(item => item.data).flat()
    const axis = getAxis(layout.axes, AXIS_TYPE, AXIS_INDEX)
    const extremeObj = extraOptions.outlierHelper?.extremeLines
        ? extraOptions.outlierHelper.extremeLines[0]
        : null
    // const xMax = extraOptions.outlierHelper?.vars?.xyStats?.xMax

    return objectClean({
        min: getMinValue(
            axis.minValue,
            dataValues,
            extraOptions.outlierHelper?.xAxisMin
        ),
        max: getMaxValue(
            axis.maxValue,
            dataValues,
            extraOptions.outlierHelper?.xAxisMax
        ),
        // extremeObj?.value > xMax
        //     ? extremeObj?.value * 1.1
        // : getMaxValue(
        //       axis.maxValue,
        //       dataValues,
        //       extraOptions.outlierHelper
        //   ),
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
            getRegressionLine(axis.targetLine, layout.type, true),
            getRegressionLine(axis.baseLine, layout.type, true),
            extremeObj
                ? getRegressionLine(
                      {
                          value: extremeObj.value,
                          color: '#a9adb3',
                          width: 1,
                          dashStyle: 'Dash',
                          title: {
                              text: extremeObj.name,
                          },
                      },
                      null,
                      true
                  )
                : null,
        ]),
        gridLineColor: getGridLineColor(),
        labels: getLabels(axis),
        id: getAxisStringFromId(0),
    })
}
