import isString from 'd2-utilizr/lib/isString'
import {
    FONT_STYLE_OPTION_ITALIC,
    FONT_STYLE_OPTION_BOLD,
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    FONT_STYLE_VISUALIZATION_SUBTITLE,
    mergeFontStyleWithDefault,
} from '../../../../../modules/fontStyle.js'
import {
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    isVerticalType,
    VIS_TYPE_SCATTER,
} from '../../../../../modules/visTypes.js'
import getFilterText from '../../../../util/getFilterText.js'
import { getTextAlignOption } from '../getTextAlignOption.js'
import getYearOverYearTitle from '../title/yearOverYear.js'

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

export default function (series, layout, metaData, dashboard) {
    const fontStyle = mergeFontStyleWithDefault(
        layout.fontStyle && layout.fontStyle[FONT_STYLE_VISUALIZATION_SUBTITLE],
        FONT_STYLE_VISUALIZATION_SUBTITLE
    )
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
            case VIS_TYPE_SCATTER:
                subtitle.text = filterTitle
                break
            default:
                subtitle = getDefault(layout, dashboard, filterTitle)
        }
    }

    return subtitle
        ? Object.assign(
              {},
              dashboard
                  ? DASHBOARD_SUBTITLE
                  : {
                        align: getTextAlignOption(
                            fontStyle[FONT_STYLE_OPTION_TEXT_ALIGN],
                            FONT_STYLE_VISUALIZATION_SUBTITLE,
                            isVerticalType(layout.type)
                        ),
                        style: {
                            // DHIS2-578: dynamically truncate subtitle when it's taking more than 1 line
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
              subtitle
          )
        : subtitle
}
