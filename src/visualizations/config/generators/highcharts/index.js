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
    const pick = H.pick
    H.wrap(
        H.seriesTypes.column.prototype,
        'drawLegendSymbol',
        function (proceed, legend, item) {
            if (this.options.legendSet?.legends?.length) {
                const ys = legend.baseline - legend.symbolHeight + 1, // y start
                    x = legend.symbolWidth / 2 > 8 ? legend.symbolWidth / 2 : 8, // x start
                    ye = legend.symbolHeight + ys // y end
                const legends = this.options.legendSet.legends.sort(
                    (a, b) => a.startValue - b.startValue
                )
                this.chart.renderer
                    .path(['M', x, ys, 'A', 1, 1, 0, 0, 0, x, ye, 'V', ys])
                    .attr({
                        fill: legends.at(legends.length >= 5 ? 1 : 0).color,
                    })
                    .add(this.legendGroup)
                this.chart.renderer
                    .path(['M', x, ye, 'A', 1, 1, 0, 0, 0, x, ys, 'V', ye])
                    .attr({
                        fill: legends.at(legends.length >= 5 ? -2 : -1).color,
                    })
                    .add(this.legendGroup)
            } else {
                var options = legend.options,
                    symbolHeight = legend.symbolHeight,
                    square = options.squareSymbol,
                    symbolWidth = square ? symbolHeight : legend.symbolWidth
                item.legendSymbol = this.chart.renderer
                    .rect(
                        square ? (legend.symbolWidth - symbolHeight) / 2 : 0,
                        legend.baseline - symbolHeight + 1,
                        symbolWidth,
                        symbolHeight,
                        pick(legend.options.symbolRadius, symbolHeight / 2)
                    )
                    .addClass('highcharts-point')
                    .attr({
                        zIndex: 3,
                    })
                    .add(item.legendGroup)
            }
        }
    )
}

export default function (config, el) {
    if (config) {
        config.chart.renderTo = el || config.chart.renderTo

        if (config.lang) {
            H.setOptions({
                lang: config.lang,
            })
        }

        drawLegendSymbolWrap()

        return new H.Chart(config)
    }
}
