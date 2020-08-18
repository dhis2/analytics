import getType from './type'

const DEFAULT_CHART = {
    spacingTop: 20,
    style: {
        fontFamily: 'Roboto,Helvetica Neue,Helvetica,Arial,sans-serif',
    },
}

const DASHBOARD_CHART = {
    spacingTop: 0,
    spacingRight: 5,
    spacingBottom: 2,
    spacingLeft: 5,
}

const getEvents = () => ({
    events: {
        load: function() { // Align legend icon with legend text
            this.legend.allItems.forEach((item) => {
                item.legendSymbol.attr({
                    translateY: -((item.legendItem.getBBox().height) * 0.75 / 4 ) + ( item.legendSymbol.r / 2 )
                });
            });
        }
    }
})

export default function(layout, el, dashboard) {
    return Object.assign(
        {},
        getType(layout.type),
        { renderTo: el || layout.el },
        DEFAULT_CHART,
        dashboard ? DASHBOARD_CHART : undefined,
        getEvents(),
    )
}
