import {
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_BOLD,
    FONT_STYLE_OPTION_ITALIC,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    FONT_STYLE_LEGEND,
    mergeFontStyleWithDefault,
} from '../../../../modules/fontStyle.js'
import {
    isVerticalType,
    VIS_TYPE_SCATTER,
} from '../../../../modules/visTypes.js'
import { getTextAlignOption } from './getTextAlignOption.js'

const DASHBOARD_ITEM_STYLE = {
    fontSize: '11px',
    fontWeight: 500,
}

const DASHBOARD_LEGEND = {
    symbolPadding: 3,
    itemDistance: 10,
}

function getItemStyle(fontStyle, dashboard) {
    return {
        itemStyle: Object.assign(
            {},
            {
                fontSize: '13px',
                fontWeight: 'normal',
            },
            dashboard
                ? DASHBOARD_ITEM_STYLE
                : {
                      color: fontStyle[FONT_STYLE_OPTION_TEXT_COLOR],
                      fontSize: `${fontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`,
                      fontWeight: fontStyle[FONT_STYLE_OPTION_BOLD]
                          ? FONT_STYLE_OPTION_BOLD
                          : 'normal',
                      fontStyle: fontStyle[FONT_STYLE_OPTION_ITALIC]
                          ? FONT_STYLE_OPTION_ITALIC
                          : 'normal',
                  }
        ),
    }
}

function getLegend(fontStyle, dashboard, visType) {
    return Object.assign(
        {},
        dashboard
            ? DASHBOARD_LEGEND
            : {
                  align: getTextAlignOption(
                      fontStyle[FONT_STYLE_OPTION_TEXT_ALIGN],
                      FONT_STYLE_LEGEND,
                      isVerticalType(visType)
                  ),
              }
    )
}

export default function ({ isHidden, fontStyle, visType, dashboard }) {
    const mergedFontStyle = mergeFontStyleWithDefault(
        fontStyle,
        FONT_STYLE_LEGEND
    )
    return isHidden || visType === VIS_TYPE_SCATTER
        ? {
              enabled: false,
          }
        : Object.assign(
              {},
              getLegend(mergedFontStyle, dashboard, visType),
              getItemStyle(mergedFontStyle, dashboard)
          )
}
