import loadCustomSVG from './loadCustomSVG/index.js'

export const getEvents = (visType) => ({
    events: {
        load: function () {
            // Align legend icon with legend text
            this.legend.allItems.forEach((item) => {
                if (item.legendSymbol) {
                    item.legendSymbol.attr({
                        translateY:
                            -(
                                (item.legendItem.label.getBBox().height *
                                    0.75) /
                                4
                            ) +
                            item.legendSymbol.r / 2,
                    })
                }
            })
            loadCustomSVG.call(this, visType)
        },
    },
})
