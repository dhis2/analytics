import isString from 'd2-utilizr/lib/isString'
import getFilterText from '../../../../util/getFilterText'
import {
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
} from '../../../../../modules/visTypes'
import getYearOverYearTitle from '../title/yearOverYear'
import { 
    FONT_STYLE_OPTION_ITALIC, 
    FONT_STYLE_OPTION_BOLD, 
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    FONT_STYLE_VISUALIZATION_SUBTITLE
 } from '../../../../../modules/fontStyle'
import { getTextAlignOption } from '../getTextAlignOption'

const DASHBOARD_SUBTITLE = {
    style: {
        // DHIS2-578: dynamically truncate subtitle when it's taking more than 1 line
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '12px',
        color: '#555',
        textShadow: '0 0 #999',
    },
}

function getDefault(layout, dashboard, filterTitle) {
    return {
        text: dashboard || isString(layout.title) ? filterTitle : undefined,
    }
}

export default function(series, layout, metaData, dashboard) {
    const fontStyle = layout.fontStyle && layout.fontStyle[FONT_STYLE_VISUALIZATION_SUBTITLE]
    let subtitle = {
        text: undefined,
    }

    if (layout.hideSubtitle) {
        return null
    }

    // DHIS2-578: allow for optional custom subtitle
    if (isString(layout.subtitle)) {
        subtitle.text = layout.subtitle
    } else {
        const filterTitle = getFilterText(layout.filters, metaData)

        switch (layout.type) {
            case VIS_TYPE_YEAR_OVER_YEAR_LINE:
            case VIS_TYPE_YEAR_OVER_YEAR_COLUMN:
                subtitle.text = getYearOverYearTitle(
                    layout,
                    metaData,
                    Boolean(!dashboard)
                )
                break
            default:
                subtitle = getDefault(layout, dashboard, filterTitle)
        }
    }

    return subtitle
        ? Object.assign(
              {},
              dashboard ? DASHBOARD_SUBTITLE : {
                align: (getTextAlignOption(fontStyle[FONT_STYLE_OPTION_TEXT_ALIGN], FONT_STYLE_VISUALIZATION_SUBTITLE, layout.type)),
                style: {
                    // DHIS2-578: dynamically truncate subtitle when it's taking more than 1 line
                    color: fontStyle[FONT_STYLE_OPTION_TEXT_COLOR],
                    fontSize: `${fontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`,
                    fontWeight: fontStyle[FONT_STYLE_OPTION_BOLD] ? FONT_STYLE_OPTION_BOLD : 'normal',
                    fontStyle: fontStyle[FONT_STYLE_OPTION_ITALIC] ? FONT_STYLE_OPTION_ITALIC : 'normal',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
            },
              subtitle
          )
        : subtitle
}
