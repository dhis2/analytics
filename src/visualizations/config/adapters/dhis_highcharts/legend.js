import {
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_BOLD,
    FONT_STYLE_OPTION_ITALIC,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    FONT_STYLE_LEGEND,
    mergeFontStyleWithDefault,
} from '../../../../modules/fontStyle'
import { LEGEND_DISPLAY_STRATEGY_FIXED } from '../../../../modules/legends'
import { isVerticalType, VIS_TYPE_SCATTER } from '../../../../modules/visTypes'
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

export default function (
    isHidden,
    fontStyle,
    visType,
    dashboard,
    legendSets = [],
    metaData,
    displayStrategy
) {
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
              getItemStyle(mergedFontStyle, dashboard),
              {
                  useHTML: true,
                  symbolWidth: 0.001,
                  symbolHeight: 0.001,
                  labelFormatter: function () {
                      // TODO: Extract to a separate file and clean up the code
                      const seriesId = this.userOptions?.id
                      const legendSet =
                          displayStrategy === LEGEND_DISPLAY_STRATEGY_FIXED &&
                          legendSets.length
                              ? legendSets[0]
                              : legendSets.find(
                                    legendSet =>
                                        legendSet.id ===
                                        metaData[seriesId]?.legendSet
                                )
                      const bulletStyle = `display: inline-block; border-radius: 50%; width: ${mergedFontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px; height: ${mergedFontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px;`
                      let format =
                          '<div style="display: flex; align-items: center;">'
                      format += legendSet?.legends?.length
                          ? legendSet.legends
                                .map(
                                    (legend, index) =>
                                        `<span style="${bulletStyle} background-color: ${
                                            legend.color
                                        }; margin-right:-5px; z-index: ${
                                            legendSet.legends.length - index
                                        }"></span>`
                                )
                                .join('') +
                            `<span style="margin-left: 8px">${this.name}</span>`
                          : `<span style="${bulletStyle} background-color: ${this.color}; margin-right:5px"></span>` +
                            `<span>${this.name}</span>`
                      format += '</div>'
                      return format
                  },
              }
          )
}
