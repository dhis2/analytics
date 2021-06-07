import isString from 'd2-utilizr/lib/isString'
import {
    FONT_STYLE_OPTION_ITALIC,
    FONT_STYLE_OPTION_BOLD,
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    FONT_STYLE_VISUALIZATION_TITLE,
    mergeFontStyleWithDefault,
} from '../../../../../modules/fontStyle'
import {
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_GAUGE,
    isVerticalType,
    VIS_TYPE_SCATTER,
} from '../../../../../modules/visTypes'
import getFilterText from '../../../../util/getFilterText'
import { getTextAlignOption } from '../getTextAlignOption'
import getScatterTitle from './scatter'
import getYearOverYearTitle from './yearOverYear'

const DASHBOARD_TITLE_STYLE = {
    margin: 15,
    y: 12,
    style: {
        fontSize: '13px',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
}

function getDefault(layout, metaData, dashboard) {
    // filters
    if (layout.filters && !dashboard) {
        return getFilterText(layout.filters, metaData)
    }

    return null
}

export default function (layout, metaData, dashboard) {
    const fontStyle = mergeFontStyleWithDefault(
        layout.fontStyle && layout.fontStyle[FONT_STYLE_VISUALIZATION_TITLE],
        FONT_STYLE_VISUALIZATION_TITLE
    )

    const title = {
        text: undefined,
    }

    if (layout.hideTitle) {
        return title
    }

    if (isString(layout.title) && layout.title.length) {
        title.text = layout.title
    } else {
        switch (layout.type) {
            case VIS_TYPE_GAUGE:
            case VIS_TYPE_YEAR_OVER_YEAR_LINE:
            case VIS_TYPE_YEAR_OVER_YEAR_COLUMN:
                title.text = getYearOverYearTitle(layout, metaData, dashboard)
                break
            case VIS_TYPE_SCATTER:
                title.text = getScatterTitle(layout, metaData, dashboard)
                break
            default:
                title.text = getDefault(layout, metaData, dashboard)
                break
        }
    }

    return Object.assign(
        {},
        dashboard
            ? DASHBOARD_TITLE_STYLE
            : {
                  margin: 30,
                  align: getTextAlignOption(
                      fontStyle[FONT_STYLE_OPTION_TEXT_ALIGN],
                      FONT_STYLE_VISUALIZATION_TITLE,
                      isVerticalType(layout.type)
                  ),
                  style: {
                      color: fontStyle[FONT_STYLE_OPTION_TEXT_COLOR],
                      fontSize: `${fontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`,
                      fontWeight: fontStyle[FONT_STYLE_OPTION_BOLD]
                          ? FONT_STYLE_OPTION_BOLD
                          : 'normal',
                      fontStyle: fontStyle[FONT_STYLE_OPTION_ITALIC]
                          ? FONT_STYLE_OPTION_ITALIC
                          : 'normal',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                  },
              },
        title
    )
}
