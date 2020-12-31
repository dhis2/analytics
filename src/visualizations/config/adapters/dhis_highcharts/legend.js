import {
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_BOLD,
    FONT_STYLE_OPTION_ITALIC,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    FONT_STYLE_LEGEND,
    mergeFontStyleWithDefault,
} from '../../../../modules/fontStyle'
import { getTextAlignOption } from './getTextAlignOption'

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
        {
            symbolWidth: 11,
            symbolHeight: 11,
            itemMarginBottom: 2,
        },
        dashboard
            ? DASHBOARD_LEGEND
            : {
                  align: getTextAlignOption(
                      fontStyle[FONT_STYLE_OPTION_TEXT_ALIGN],
                      FONT_STYLE_LEGEND,
                      visType
                  ),
              }
    )
}

export default function (layout, dashboard) {
    const fontStyle = mergeFontStyleWithDefault(
        layout.legend?.label?.fontStyle,
        FONT_STYLE_LEGEND
    )
    return layout.legend?.hidden
        ? {
              enabled: false,
          }
        : Object.assign(
              {},
              getLegend(fontStyle, dashboard, layout.type),
              getItemStyle(fontStyle, dashboard)
          )
}
