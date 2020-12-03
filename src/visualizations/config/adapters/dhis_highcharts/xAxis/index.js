import objectClean from 'd2-utilizr/lib/objectClean'
import getAxisTitle from '../getAxisTitle'
import getCategories from '../getCategories'
import getYearOnYear from './yearOnYear'
import getTwoCategory from './twoCategory'
import getRadar from './radar'
import {
    VIS_TYPE_GAUGE,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_PIE,
    VIS_TYPE_RADAR,
    isTwoCategoryChartType,
} from '../../../../../modules/visTypes'
import {
    FONT_STYLE_HORIZONTAL_AXIS_TITLE,
    FONT_STYLE_CATEGORY_AXIS_LABELS,
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_BOLD,
    FONT_STYLE_OPTION_ITALIC,
} from '../../../../../modules/fontStyle'

function noAxis() {
    return null
}

export const getLabelsStyle = fontStyle =>
    fontStyle
        ? {
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
          }
        : {}

export const getDefault = (store, layout) =>
    objectClean({
        categories: getCategories(
            store.data[0].metaData,
            layout.rows[0].dimension
        ),
        title: getAxisTitle(
            layout.domainAxisLabel,
            layout.fontStyle[FONT_STYLE_HORIZONTAL_AXIS_TITLE],
            FONT_STYLE_HORIZONTAL_AXIS_TITLE,
            layout.type
        ),
        labels: getLabelsStyle(
            layout.fontStyle[FONT_STYLE_CATEGORY_AXIS_LABELS]
        ),
    })

export default function (store, layout, extraOptions) {
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
            default:
                xAxis = [getDefault(store, layout)]
        }
    }

    return xAxis
}
