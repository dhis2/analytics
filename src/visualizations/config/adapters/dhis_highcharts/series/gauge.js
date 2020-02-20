import { getColorByValueFromLegendSet, LEGEND_DISPLAY_STYLE_TEXT } from "../../../../../modules/legends"

const DEFAULT_FONT_SIZE = '34px'
const DASHBOARD_FONT_SIZE = '24px'

export default function(series, layout, extraOptions) {
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
                    fontSize: extraOptions.dashboard ? DASHBOARD_FONT_SIZE : DEFAULT_FONT_SIZE,
                    color: (layout.legendDisplayStyle === LEGEND_DISPLAY_STYLE_TEXT && extraOptions.legendSet) ? getColorByValueFromLegendSet(extraOptions.legendSet, series[0].data) : undefined,
                },
            },
        },
    ]
}
