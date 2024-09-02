import H from 'highcharts'
import HM from 'highcharts/highcharts-more'
import HB from 'highcharts/modules/boost'
import HE from 'highcharts/modules/exporting'
import HNDTD from 'highcharts/modules/no-data-to-display'
import HOE from 'highcharts/modules/offline-exporting'
import HPF from 'highcharts/modules/pattern-fill'
import HSG from 'highcharts/modules/solid-gauge'
import renderSingleValueSvg from './renderSingleValueSvg/index.js'

// apply
HM(H)
HSG(H)
HNDTD(H)
HE(H)
HOE(H)
HPF(H)
HB(H)

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

export function highcharts(config, el) {
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

export function singleValue(config, el, extraOptions) {
    console.log('el', el)
    let elClientHeight, elClientWidth
    return H.chart(el, {
        accessibility: { enabled: false },
        chart: {
            backgroundColor: 'transparent',
            events: {
                redraw: function () {
                    if (
                        el.clientHeight !== elClientHeight ||
                        el.clientWidth !== elClientWidth
                    ) {
                        console.log('resize!!!', el)
                        elClientHeight = el.clientHeight
                        elClientWidth = el.clientWidth
                        renderSingleValueSvg(config, el, extraOptions, this)
                    } else {
                        console.log('No action needed')
                    }
                },
            },
            animation: false,
        },
        credits: { enabled: false },
        // exporting: {
        //     enabled: false,
        // },
        lang: {
            noData: null,
        },
        noData: {},
        title: null,
    })
}
