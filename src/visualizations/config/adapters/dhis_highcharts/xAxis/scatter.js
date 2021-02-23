import arrayClean from 'd2-utilizr/lib/arrayClean'
import objectClean from 'd2-utilizr/lib/objectClean'
import isNumeric from 'd2-utilizr/lib/isNumeric'

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
    getMaxValue,
    getMinValue,
    getRegressionLine,
} from '../axis'

const AXIS_TYPE = 'RANGE'
const AXIS_INDEX = 1

export default function (layout, series, extraOptions) {
    const dataValues = series?.map(item => item.data).flat()
    const axis = getAxis(layout.axes, AXIS_TYPE, AXIS_INDEX)
    const extremeObj =
        extraOptions.outlierHelper?.extremes?.length &&
        extraOptions.outlierHelper.extremes[0]
    const maxVal = getMaxValue(axis.maxValue, dataValues)

    return objectClean({
        min: getMinValue(axis.minValue, dataValues),
        max:
            Math.max(isNumeric(maxVal) ? maxVal : null, extremeObj.value) ??
            undefined,
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
            extremeObj &&
                getRegressionLine(
                    {
                        value: extremeObj.value / 2, //TODO
                        color: '#a9adb3',
                        width: 1,
                        dashStyle: 'Dash',
                        title: {
                            text: extremeObj.name,
                        },
                    },
                    null,
                    true
                ),
        ]),
        gridLineColor: getGridLineColor(),
        labels: getLabels(axis),
        id: getAxisStringFromId(0),
    })
}
