import H from 'highcharts'
import HM from 'highcharts/highcharts-more'
import HSG from 'highcharts/modules/solid-gauge'
import HNDTD from 'highcharts/modules/no-data-to-display'
import HE from 'highcharts/modules/exporting'

// apply
HM(H)
HSG(H)
HNDTD(H)
HE(H)

export default function(config, el) {
    if (config) {
        config.chart.renderTo = el || config.chart.renderTo

        return new H.Chart(config)
    }
}
