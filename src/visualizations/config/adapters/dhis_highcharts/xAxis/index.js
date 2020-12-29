import objectClean from 'd2-utilizr/lib/objectClean'

import getAxisTitle from '../getAxisTitle'
import getCategories from '../getCategories'
import getYearOnYear from './yearOnYear'
import getTwoCategory from './twoCategory'
import getRadar from './radar'
import getScatter from './scatter'
import {
    VIS_TYPE_GAUGE,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_PIE,
    VIS_TYPE_RADAR,
    VIS_TYPE_SCATTER,
    isTwoCategoryChartType,
} from '../../../../../modules/visTypes'
import {
    FONT_STYLE_HORIZONTAL_AXIS_TITLE,
    FONT_STYLE_AXIS_LABELS,
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_BOLD,
    FONT_STYLE_OPTION_ITALIC,
    defaultFontStyle,
} from '../../../../../modules/fontStyle'
import getFormatter from '../getFormatter'
import { getAxis } from '../../../../util/axes'

const AXIS_TYPE = 'DOMAIN'
const AXIS_INDEX = 0

function noAxis() {
    return null
}

export const getLabels = axis => {
    const fontStyle = {
        ...defaultFontStyle[FONT_STYLE_AXIS_LABELS],
        ...axis.label?.fontStyle,
    }
    return {
        style: {
            color: fontStyle[FONT_STYLE_OPTION_TEXT_COLOR],
            fontSize: `${fontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`,
            fontWeight: fontStyle[FONT_STYLE_OPTION_BOLD]
                ? FONT_STYLE_OPTION_BOLD
                : 'normal',
            fontStyle: fontStyle[FONT_STYLE_OPTION_ITALIC]
                ? FONT_STYLE_OPTION_ITALIC
                : 'normal',
        },
        ...getFormatter(axis),
    }
}

export const getDefault = (store, layout) => {
    const axis = getAxis(layout.axes, AXIS_TYPE, AXIS_INDEX)
    return objectClean({
        categories: getCategories(
            store.data[0].metaData,
            layout.rows[0].dimension
        ),
        title: getAxisTitle(
            axis.title?.text,
            {
                ...defaultFontStyle[FONT_STYLE_HORIZONTAL_AXIS_TITLE],
                ...axis.title?.fontStyle,
            },
            FONT_STYLE_HORIZONTAL_AXIS_TITLE,
            layout.type
        ),
        labels: getLabels(axis),
    })
}

export default function (store, layout, extraOptions, series) {
    let xAxis

    if (isTwoCategoryChartType(layout.type) && layout.rows.length > 1) {
        xAxis = getTwoCategory(store, layout, extraOptions)
    } else {
        switch (layout.type) {
            case VIS_TYPE_PIE:
            case VIS_TYPE_GAUGE:
                xAxis = noAxis()
                break
            case VIS_TYPE_YEAR_OVER_YEAR_LINE:
            case VIS_TYPE_YEAR_OVER_YEAR_COLUMN:
                xAxis = [getYearOnYear(store, layout, extraOptions)]
                break
            case VIS_TYPE_RADAR:
                xAxis = [getRadar(store, layout)]
                break
            case VIS_TYPE_SCATTER:
                xAxis = [getScatter(layout, series)]
                break
            default:
                xAxis = [getDefault(store, layout)]
        }
    }

    return xAxis
}
