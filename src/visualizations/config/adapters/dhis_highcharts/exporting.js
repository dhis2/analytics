import { VIS_TYPE_SINGLE_VALUE } from '../../../../modules/visTypes.js'
import { getSingleValueBackgroundColor } from './customSVGOptions/singleValue/getSingleValueBackgroundColor.js'
import loadSingleValueSVG from './events/loadCustomSVG/singleValue/index.js'

const DEFAULT_EXPORT_BACKGROUND_COLOR = '#ffffff'
const BASE_EXPORTING_CONFIG = {
    // disable exporting context menu
    enabled: false,
    // use offline exporting only
    fallbackToExportServer: false,
    allowHTML: true,
    showExportInProgress: true,
    applyStyleSheets: true,
    sourceHeight: 768,
    sourceWidth: 1024,
    scale: 1,
    chartOptions: {
        chart: {
            backgroundColor: DEFAULT_EXPORT_BACKGROUND_COLOR,
        },
    },
}

export default function getExporting(layout, legendSets, series) {
    switch (layout.type) {
        case VIS_TYPE_SINGLE_VALUE:
            return {
                ...BASE_EXPORTING_CONFIG,
                chartOptions: {
                    ...BASE_EXPORTING_CONFIG.chartOptions,
                    chart: {
                        ...BASE_EXPORTING_CONFIG.chartOptions.chart,
                        backgroundColor: getSingleValueBackgroundColor(
                            layout.legend,
                            legendSets,
                            series[0],
                            DEFAULT_EXPORT_BACKGROUND_COLOR
                        ),
                        events: {
                            load: loadSingleValueSVG,
                        },
                    },
                },
            }

        default:
            return BASE_EXPORTING_CONFIG
    }
}
