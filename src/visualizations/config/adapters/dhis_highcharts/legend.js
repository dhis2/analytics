
import { 
    FONT_STYLE_OPTION_FONT_SIZE, 
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_BOLD ,
    FONT_STYLE_OPTION_ITALIC,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    FONT_STYLE_LEGEND,
} from '../../../../modules/fontStyle'

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
            dashboard ? DASHBOARD_ITEM_STYLE : {
                color: fontStyle[FONT_STYLE_OPTION_TEXT_COLOR],
                fontSize: `${fontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`,
                fontWeight: fontStyle[FONT_STYLE_OPTION_BOLD] ? FONT_STYLE_OPTION_BOLD : 'normal',
                fontStyle: fontStyle[FONT_STYLE_OPTION_ITALIC] ? FONT_STYLE_OPTION_ITALIC : 'normal'
            }
        ),
    }
}

function getLegend(fontStyle, dashboard) {
    return Object.assign(
        {},
        {
            symbolWidth: 11,
            symbolHeight: 11,
            itemMarginBottom: 2,
        },
        dashboard ? DASHBOARD_LEGEND : {
            align: fontStyle[FONT_STYLE_OPTION_TEXT_ALIGN],
        }
    )
}

export default function(layout, dashboard) {
    const fontStyle = layout.fontStyle[FONT_STYLE_LEGEND]
    return layout.hideLegend
        ? {
              enabled: false,
          }
        : Object.assign({}, getLegend(fontStyle, dashboard), getItemStyle(fontStyle, dashboard))
}
