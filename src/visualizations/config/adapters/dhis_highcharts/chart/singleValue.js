import { getSingleValueBackgroundColor } from '../customSVGOptions/singleValue/getSingleValueBackgroundColor.js'
import getDefaultChart from './default.js'

export default function getSingleValueChart(layout, el, extraOptions, series) {
    const chart = {
        ...getDefaultChart(layout, el, extraOptions),
        backgroundColor: getSingleValueBackgroundColor(
            layout.legend,
            extraOptions.legendSets,
            series[0]
        ),
    }

    if (extraOptions.dashboard) {
        chart.spacingTop = 7
    }

    return chart
}
