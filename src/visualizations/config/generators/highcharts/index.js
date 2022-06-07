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
    H.seriesTypes.column.prototype.drawLegendSymbol = function () {
        if (this.options.legendSet?.legends?.length) {
            this.options.legendSet.legends
                .sort((a, b) => b.startValue - a.startValue)
                .forEach((legend, index) => {
                    this.chart.renderer
                        .circle(
                            10 + index * -(this.options.fontSize - 5),
                            Math.round(this.options.fontSize * 0.615 * 10) /
                                10 +
                                3,
                            this.options.fontSize / 2
                        )
                        .attr({
                            fill: legend.color,
                        })
                        .add(this.legendGroup)
                })
        } else {
            this.chart.renderer
                .circle(-10, 10, 8)
                .attr({
                    fill: 'pink',
                })
                .add(this.legendGroup)
        }
    }
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
