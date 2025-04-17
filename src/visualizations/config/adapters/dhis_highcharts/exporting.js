import {
    VIS_TYPE_SCATTER,
    VIS_TYPE_SINGLE_VALUE,
} from '../../../../modules/visTypes.js'
import loadSingleValueSVG from './events/loadCustomSVG/singleValue/index.js'

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
            backgroundColor: '#ffffff',
        },
    },
}

export default function getExporting(visType) {
    switch (visType) {
        case VIS_TYPE_SINGLE_VALUE:
            return {
                ...BASE_EXPORTING_CONFIG,
                chartOptions: {
                    ...BASE_EXPORTING_CONFIG.chartOptions,
                    chart: {
                        ...BASE_EXPORTING_CONFIG.chartOptions.chart,
                        events: {
                            load: loadSingleValueSVG,
                        },
                    },
                },
            }
        // This is a workaround for https://github.com/highcharts/highcharts/issues/8333
        case VIS_TYPE_SCATTER:
            return {
                ...BASE_EXPORTING_CONFIG,
                chartOptions: {
                    ...BASE_EXPORTING_CONFIG.chartOptions,
                    boost: {
                        enabled: false,
                    },
                },
            }

        default:
            return BASE_EXPORTING_CONFIG
    }
}
