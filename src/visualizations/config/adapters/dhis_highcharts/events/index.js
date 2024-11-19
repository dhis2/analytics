import loadCustomSVG from './loadCustomSVG/index.js'

export const getEvents = (visType) => ({
    events: {
        load: function () {
            console.log('THIS HAPPENS AFTER THE CHART IS CREATED')
            console.log(
                'on load the yAxis does have a max: ',
                this.yAxis[0].max
            )
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
        render: function () {
            console.log(
                'on render the yAxis does have a max: ',
                this.yAxis[0].max
            )
        },
    },
})
