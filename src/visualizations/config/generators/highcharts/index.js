import H from 'highcharts'
import HM from 'highcharts/highcharts-more'
import HB from 'highcharts/modules/boost'
import HE from 'highcharts/modules/exporting'
import HNDTD from 'highcharts/modules/no-data-to-display'
import HPF from 'highcharts/modules/pattern-fill'
import HSG from 'highcharts/modules/solid-gauge'

// apply
HM(H)
HSG(H)
HNDTD(H)
HE(H)
HPF(H)
HB(H)

export default function (config, el) {
    if (config) {
        config.chart.renderTo = el || config.chart.renderTo

        if (config.lang) {
            H.setOptions({
                lang: config.lang,
            })
        }

        return new H.Chart(config)
    }
}
