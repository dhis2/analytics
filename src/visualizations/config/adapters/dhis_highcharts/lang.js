import { VIS_TYPE_SINGLE_VALUE } from '../../../../modules/visTypes.js'

export default function getLang(visType, extraOptions) {
    return {
        /* The SingleValue visualization consists of some custom SVG elements
         * rendered on an empty chart. Since the chart is empty, there is never
         * any data and Highcharts will show the noData text. To avoid this we
         * clear the text here. */
        noData:
            visType === VIS_TYPE_SINGLE_VALUE
                ? undefined
                : extraOptions.noData.text,
        resetZoom: extraOptions.resetZoom.text,
    }
}
