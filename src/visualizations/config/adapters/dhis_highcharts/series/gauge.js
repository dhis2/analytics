import {
    getColorByValueFromLegendSet,
    LEGEND_DISPLAY_STYLE_TEXT,
} from '../../../../../modules/legends'

const DEFAULT_FONT_SIZE = '28px'

export default function(series, dashboard, layout, legendSet) {
    return [
        {
            name: series[0].name,
            data: series[0].data,
            enableMouseTracking: false,
            dataLabels: {
                y: 0,
                borderWidth: 0,
                verticalAlign: 'bottom',
                style: {
                    fontSize: DEFAULT_FONT_SIZE,
                    color:
                        layout.legendDisplayStyle ===
                            LEGEND_DISPLAY_STYLE_TEXT && legendSet
                            ? getColorByValueFromLegendSet(
                                  legendSet,
                                  series[0].data
                              )
                            : undefined,
                },
            },
        },
    ]
}
