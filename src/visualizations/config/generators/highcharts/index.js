import H from 'highcharts'
import HM from 'highcharts/highcharts-more'
import HSG from 'highcharts/modules/solid-gauge'
import HNDTD from 'highcharts/modules/no-data-to-display'
import HE from 'highcharts/modules/exporting'
import HPF from 'highcharts/modules/pattern-fill'
import HB from 'highcharts/modules/boost'

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
