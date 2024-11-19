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

/* Whitelist some additional SVG attributes here. Without this,
 * the PDF export for the SingleValue visualization breaks. */
H.AST.allowedAttributes.push('fill-rule', 'clip-rule')

function drawLegendSymbolWrap() {
    const pick = H.pick
    H.wrap(
        H.seriesTypes.column.prototype,
        'drawLegendSymbol',
        function (proceed, legend, item) {
            const legendItem = item.legendItem

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
                        fill: legends[legends.length >= 5 ? 1 : 0].color,
                    })
                    .add(legendItem.group)
                this.chart.renderer
                    .path(['M', x, ye, 'A', 1, 1, 0, 0, 0, x, ys, 'V', ye])
                    .attr({
                        fill: legends[
                            legends.length >= 5
                                ? legends.length - 2
                                : legends.length - 1
                        ].color,
                    })
                    .add(legendItem.group)
            } else {
                var options = legend.options,
                    symbolHeight = legend.symbolHeight,
                    square = options.squareSymbol,
                    symbolWidth = square ? symbolHeight : legend.symbolWidth

                legendItem.symbol = this.chart.renderer
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
                    .add(legendItem.group)
            }
        }
    )
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

        console.log('HERE WE PASS THE CONFIG TO HIGHCHARTS')
        console.log('There is only one yAxis: ', config.yAxis.length === 1)
        console.log(
            'That single yAxis does not have a max',
            typeof config.yAxis[0].max === 'undefined'
        )

        return new H.Chart(config)
    }
}
