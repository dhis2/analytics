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
    VIS_TYPE_SINGLE_VALUE,
} from '../../../../../modules/visTypes.js'
import getFilterText from '../../../../util/getFilterText.js'
import { getTextAlignOption } from '../getTextAlignOption.js'
import getYearOverYearTitle from '../title/yearOverYear.js'
import getSingleValueSubtitle from './singleValue.js'

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
    return dashboard || isString(layout.title) ? filterTitle : undefined
}

export default function (series, layout, metaData, extraOptions) {
    if (layout.hideSubtitle) {
        return null
    }

    const { dashboard, legendSets, legendOptions } = extraOptions
    const fontStyle = mergeFontStyleWithDefault(
        layout.fontStyle && layout.fontStyle[FONT_STYLE_VISUALIZATION_SUBTITLE],
        FONT_STYLE_VISUALIZATION_SUBTITLE
    )
    const subtitle = Object.assign(
        {
            text: undefined,
        },
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
                      color: undefined,
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
              }
    )

    // DHIS2-578: allow for optional custom subtitle
    const customSubtitle =
        (layout.subtitle && layout.displaySubtitle) || layout.subtitle

    if (isString(customSubtitle) && customSubtitle.length) {
        subtitle.text = customSubtitle
    } else {
        const filterTitle = getFilterText(layout.filters, metaData)

        switch (layout.type) {
            case VIS_TYPE_SINGLE_VALUE:
                subtitle.text = getSingleValueSubtitle(layout, metaData)
                break
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
                subtitle.text = getDefault(layout, dashboard, filterTitle)
        }
    }

    switch (layout.type) {
        case VIS_TYPE_SINGLE_VALUE:
            subtitle.style.color = getSingleValueSubtitleColor(
                fontStyle[FONT_STYLE_OPTION_TEXT_COLOR],
                series[0],
                legendOptions,
                legendSets
            )
            if (dashboard) {
                // Single value subtitle text should be multiline
                /* TODO: The default color of the subtitle now is #4a5768 but the
                 * original implementation used #666, which is a lighter grey.
                 * If we want to keep this color, changes are needed here. */
                Object.assign(subtitle.style, {
                    wordWrap: 'normal',
                    whiteSpace: 'normal',
                    overflow: 'visible',
                    textOverflow: 'initial',
                })
            }
            break
        default:
            subtitle.style.color = fontStyle[FONT_STYLE_OPTION_TEXT_COLOR]
            break
    }

    console.log('subtitle', subtitle)

    return subtitle
}
