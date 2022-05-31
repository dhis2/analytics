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

function drawLegendSymbolWrap() {
    H.wrap(H.Series.prototype, 'drawLegendSymbol', function (proceed, legend) {
        proceed.call(this, legend)

        // First circle
        this.customCircle1 = this.chart.renderer
            .circle(-10, 10, 8)
            .attr({
                fill: this.options.circle1color,
            })
            .add(this.legendGroup)

        // Second circle
        this.customCircle2 = this.chart.renderer
            .circle(0, 10, 8)
            .attr({
                fill: this.options.circle2color,
            })
            .add(this.legendGroup)

        // Third circle
        this.customCircle3 = this.chart.renderer
            .circle(10, 10, 8)
            .attr({
                fill: this.options.circle3color,
            })
            .add(this.legendGroup)
    })
}

export default function (config, el) {
    if (config) {
        config.chart.renderTo = el || config.chart.renderTo

        // silence warning about accessibility
        config.accessibility = { enabled: false }

        if (config.lang) {
            H.setOptions({
                lang: config.lang,
            })
        }

        drawLegendSymbolWrap()

        return new H.Chart(config)
    }
}
