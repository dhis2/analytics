const DEFAULT_ITEM_STYLE = {
    fontSize: '13px',
    fontWeight: 'normal',
}

const DASHBOARD_ITEM_STYLE = {
    fontSize: '11px',
    fontWeight: 500,
}

const DEFAULT_LEGEND = {
    symbolWidth: 11,
    symbolHeight: 11,
    itemMarginBottom: 2,
}

const DASHBOARD_LEGEND = {
    symbolPadding: 3,
    itemDistance: 10,
}

function getItemStyle(dashboard) {
    return {
        itemStyle: Object.assign(
            {},
            DEFAULT_ITEM_STYLE,
            dashboard ? DASHBOARD_ITEM_STYLE : null
        ),
    }
}

function getLegend(dashboard) {
    return Object.assign(
        {},
        DEFAULT_LEGEND,
        dashboard ? DASHBOARD_LEGEND : null
    )
}

export default function(layout, dashboard) {
    return layout.hideLegend
        ? {
              enabled: false,
          }
        : Object.assign({}, getLegend(dashboard), getItemStyle(dashboard))
}
