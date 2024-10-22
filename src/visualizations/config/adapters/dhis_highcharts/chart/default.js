import { getEvents } from '../events/index.js'
import getType from '../type.js'

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

export default function getDefaultChart(layout, el, extraOptions) {
    return Object.assign(
        {},
        getType(layout.type),
        { renderTo: el || layout.el },
        DEFAULT_CHART,
        extraOptions.dashboard ? DASHBOARD_CHART : undefined,
        getEvents(layout.type)
    )
}
