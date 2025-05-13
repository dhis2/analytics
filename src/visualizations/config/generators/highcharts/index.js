import H from 'highcharts'
import 'highcharts/highcharts-more'
import 'highcharts/modules/boost'
import 'highcharts/modules/exporting'
import 'highcharts/modules/no-data-to-display'
import 'highcharts/modules/offline-exporting'
import 'highcharts/modules/pattern-fill'
import 'highcharts/modules/solid-gauge'

/* Whitelist some additional SVG attributes and tags here. Without this,
 * the PDF export for the SingleValue visualization and charts in boost-mode
 * breaks. For more info about the boost mode issue, see:
 * https://github.com/highcharts/highcharts/issues/8333 */
H.AST.allowedTags.push('fedropshadow', 'image')
H.AST.allowedAttributes.push(
    'transform-origin',
    'preserveAspectRatio',
    'fill-rule',
    'clip-rule'
)

/* This is a workaround for https://github.com/highcharts/highcharts/issues/22008
 * We add some transparent text in a non-ASCII script to the chart to prevent
 * the chart from being exported in a serif font */
H.addEvent(H.Chart, 'load', function () {
    this.renderer.text('모', 20, 20).attr({ opacity: 0 }).add()
})

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

        return new H.Chart(config)
    }
}
