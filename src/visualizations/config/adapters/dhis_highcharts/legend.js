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
    LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM,
    LEGEND_DISPLAY_STRATEGY_FIXED,
} from '../../../../modules/legends.js'
import {
    isLegendSetType,
    isVerticalType,
    VIS_TYPE_LINE,
    VIS_TYPE_SCATTER,
} from '../../../../modules/visTypes.js'
import {
    colorSets,
    COLOR_SET_PATTERNS,
} from '../../../util/colors/colorSets.js'
import { getTextAlignOption } from './getTextAlignOption.js'
import getType from './type.js'

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
        return legendSets.find((legendSet) => legendSet.id === legendSetId)
    } else {
        return null
    }
}

const formatLabel = ({
    seriesId,
    seriesColor,
    seriesName,
    seriesType,
    metaData,
    displayStrategy,
    legendSets,
    fontStyle,
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
    if (
        (!seriesId || seriesId.startsWith('trendline')) &&
        seriesType === getType(VIS_TYPE_LINE).type
    ) {
        // trendline
        result.push(
            `<span style="height: ${
                fontStyle[FONT_STYLE_OPTION_FONT_SIZE] / 6.5
            }px; width: ${
                fontStyle[FONT_STYLE_OPTION_FONT_SIZE]
            }px; background-color: ${seriesColor}; display: inline-block;"></span>`
        )
        result.push(
            `<span style="margin-left: 8px" class="data-test-series-key-item-name">${seriesName}</span>`
        )
    } else if (
        legendSet?.legends?.length &&
        isLegendSetType(visType) &&
        seriesType !== getType(VIS_TYPE_LINE).type
    ) {
        // item with legend set
        legendSet.legends
            .sort((a, b) => a.startValue - b.startValue)
            .forEach((legend, index) =>
                result.push(
                    `<svg xmlns="http://www.w3.org/2000/svg" width="${
                        fontStyle[FONT_STYLE_OPTION_FONT_SIZE]
                    }" height="${
                        fontStyle[FONT_STYLE_OPTION_FONT_SIZE]
                    }" version="1.1"  style="margin-right:-5px; z-index: ${
                        legendSet.legends.length - index
                    }" class="data-test-series-key-item-bullet">
                    <circle cx="${
                        fontStyle[FONT_STYLE_OPTION_FONT_SIZE] / 2
                    }" cy="${fontStyle[FONT_STYLE_OPTION_FONT_SIZE] / 2}" r="${
                        fontStyle[FONT_STYLE_OPTION_FONT_SIZE] / 2
                    }" fill="${legend.color}"></circle>
                    </svg>`
                )
            )
        result.push(
            `<span style="margin-left: 8px" class="data-test-series-key-item-name">${seriesName}</span>`
        )
    } else {
        // regular item (not a trendline, no applied legend set)
        if (seriesColor?.patternIndex !== undefined) {
            const pattern =
                colorSets[COLOR_SET_PATTERNS].patterns[seriesColor.patternIndex]
            result.push(
                `<svg xmlns="http://www.w3.org/2000/svg" style="height: ${
                    fontStyle[FONT_STYLE_OPTION_FONT_SIZE]
                }px; width: ${
                    fontStyle[FONT_STYLE_OPTION_FONT_SIZE]
                }px; display: inline-block; margin-right:5px" class="data-test-series-key-item-bullet">
                <defs>
                  <pattern id="pattern${
                      seriesColor.patternIndex
                  }" patternUnits="userSpaceOnUse" width="${
                    pattern.width
                }" height="${pattern.height}">
                    <path stroke="${pattern.color}" d="${pattern.path}"/>
                  </pattern>
                </defs>
                <circle cx="${
                    fontStyle[FONT_STYLE_OPTION_FONT_SIZE] / 2
                }" cy="${fontStyle[FONT_STYLE_OPTION_FONT_SIZE] / 2}" r="${
                    fontStyle[FONT_STYLE_OPTION_FONT_SIZE] / 2
                }" fill="url(#pattern${seriesColor.patternIndex})"/>
              </svg>`
            )
        } else {
            result.push(
                `<svg xmlns="http://www.w3.org/2000/svg" width="${
                    fontStyle[FONT_STYLE_OPTION_FONT_SIZE]
                }" height="${
                    fontStyle[FONT_STYLE_OPTION_FONT_SIZE]
                }" version="1.1"  style="margin-right:5px" class="data-test-series-key-item-bullet">
                    <circle cx="${
                        fontStyle[FONT_STYLE_OPTION_FONT_SIZE] / 2
                    }" cy="${fontStyle[FONT_STYLE_OPTION_FONT_SIZE] / 2}" r="${
                    fontStyle[FONT_STYLE_OPTION_FONT_SIZE] / 2
                }" fill="${seriesColor}"></circle>
                    </svg>`
            )
        }

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
                          seriesType: this.userOptions?.type,
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
