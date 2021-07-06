import {
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_BOLD,
    FONT_STYLE_OPTION_ITALIC,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    FONT_STYLE_LEGEND,
    mergeFontStyleWithDefault,
} from '../../../../modules/fontStyle'
import {
    LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM,
    LEGEND_DISPLAY_STRATEGY_FIXED,
} from '../../../../modules/legends'
import {
    isLegendSetType,
    isVerticalType,
    VIS_TYPE_SCATTER,
} from '../../../../modules/visTypes'
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

const getLegendSetByDisplayStrategy = ({
    displayStrategy,
    legendSets,
    legendSetId,
}) => {
    if (
        displayStrategy === LEGEND_DISPLAY_STRATEGY_FIXED &&
        legendSets.length
    ) {
        return legendSets[0]
    } else if (displayStrategy === LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM) {
        return legendSets.find(legendSet => legendSet.id === legendSetId)
    } else {
        return null
    }
}

const getBulletStyleByFontStyle = fontStyle =>
    `display: inline-block; border-radius: 50%; width: ${fontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px; height: ${fontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px;`

const formatLabel = ({
    seriesId,
    metaData,
    displayStrategy,
    legendSets,
    fontStyle,
    seriesColor,
    seriesName,
    visType,
}) => {
    const legendSet = getLegendSetByDisplayStrategy({
        displayStrategy,
        legendSets,
        legendSetId: metaData[seriesId]?.legendSet,
    })
    const result = []
    // Note: Highcharts strips out 'data-test' and similar attributes, hence 'class="data-test-..." was used instead
    result.push(
        '<div style="display: flex; align-items: center; margin-bottom: 4px;" class="data-test-series-key-item">'
    )
    if (legendSet?.legends?.length && isLegendSetType(visType)) {
        legendSet.legends.forEach((legend, index) =>
            result.push(
                `<span style="${getBulletStyleByFontStyle(
                    fontStyle
                )} background-color: ${
                    legend.color
                }; margin-right:-5px; z-index: ${
                    legendSet.legends.length - index
                }" class="data-test-series-key-item-bullet"></span>`
            )
        )
        result.push(
            `<span style="margin-left: 8px" class="data-test-series-key-item-name">${seriesName}</span>`
        )
    } else {
        result.push(
            `<span style="${getBulletStyleByFontStyle(
                fontStyle
            )} background-color: ${seriesColor}; margin-right:5px" class="data-test-series-key-item-bullet"></span>`
        )
        result.push(
            `<span class="data-test-series-key-item-name">${seriesName}</span>`
        )
    }
    result.push('</div>')
    return result.join('')
}

export default function ({
    isHidden,
    fontStyle,
    visType,
    dashboard,
    legendSets = [],
    metaData,
    displayStrategy,
}) {
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
                      return formatLabel({
                          seriesId: this.userOptions?.id,
                          seriesColor: this.color,
                          seriesName: this.name,
                          metaData,
                          displayStrategy,
                          legendSets,
                          fontStyle: mergedFontStyle,
                          visType,
                      })
                  },
              }
          )
}
