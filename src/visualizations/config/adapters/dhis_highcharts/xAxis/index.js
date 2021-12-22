import objectClean from 'd2-utilizr/lib/objectClean'
import {
    FONT_STYLE_HORIZONTAL_AXIS_TITLE,
    FONT_STYLE_AXIS_LABELS,
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_BOLD,
    FONT_STYLE_OPTION_ITALIC,
    mergeFontStyleWithDefault,
} from '../../../../../modules/fontStyle.js'
import {
    VIS_TYPE_GAUGE,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_PIE,
    VIS_TYPE_RADAR,
    VIS_TYPE_SCATTER,
    isTwoCategoryChartType,
} from '../../../../../modules/visTypes.js'
import { getAxis } from '../../../../util/axes.js'
import getAxisTitle from '../getAxisTitle.js'
import getCategories from '../getCategories.js'
import getFormatter from '../getFormatter.js'
import getRadar from './radar.js'
import getScatter from './scatter.js'
import getTwoCategory from './twoCategory.js'
import getYearOnYear from './yearOnYear.js'

const AXIS_TYPE = 'DOMAIN'
const AXIS_INDEX = 0

function noAxis() {
    return null
}

export const getLabels = axis => {
    const fontStyle = mergeFontStyleWithDefault(
        axis.label?.fontStyle,
        FONT_STYLE_AXIS_LABELS
    )
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
            mergeFontStyleWithDefault(
                axis.title?.fontStyle,
                FONT_STYLE_HORIZONTAL_AXIS_TITLE
            ),
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
                xAxis = [getScatter(layout, series, extraOptions)]
                break
            default:
                xAxis = [getDefault(store, layout)]
        }
    }

    return xAxis
}
