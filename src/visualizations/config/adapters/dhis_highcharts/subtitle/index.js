import isString from 'd2-utilizr/lib/isString'
import getGauge from './gauge'
import getFilterText from '../../../../util/getFilterText'
import {
    CHART_TYPE_PIE,
    CHART_TYPE_GAUGE,
    CHART_TYPE_YEAR_OVER_YEAR_LINE,
    CHART_TYPE_YEAR_OVER_YEAR_COLUMN,
} from '../type'
import getYearOverYearTitle from '../title/yearOverYear'

const DEFAULT_SUBTITLE = {
    style: {
        // DHIS2-578: dynamically truncate subtitle when it's taking more than 1 line
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',

        fontSize: '14px',
        color: '#555',
        textShadow: '0 0 #999',
    },
}

const DASHBOARD_SUBTITLE = {
    style: {
        // DHIS2-578: dynamically truncate subtitle when it's taking more than 1 line
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',

        fontSize: '12px',
    },
}

function getDefault(layout, dashboard, filterTitle) {
    return {
        text: dashboard || isString(layout.title) ? filterTitle : undefined,
    }
}

export default function(series, layout, metaData, dashboard) {
    let subtitle = {
        text: undefined,
    }

    if (layout.hideSubtitle) {
        return null
    }

    // DHIS2-578: allow for optional custom subtitle
    if (isString(layout.subtitle)) {
        subtitle.text = layout.subtitle
    } else {
        const filterTitle = getFilterText(layout.filters, metaData)

        switch (layout.type) {
            case CHART_TYPE_YEAR_OVER_YEAR_LINE:
            case CHART_TYPE_YEAR_OVER_YEAR_COLUMN:
                subtitle.text = getYearOverYearTitle(
                    layout,
                    metaData,
                    Boolean(!dashboard)
                )
                break
            default:
                subtitle = getDefault(layout, dashboard, filterTitle)
        }
    }

    return subtitle
        ? Object.assign(
              {},
              DEFAULT_SUBTITLE,
              dashboard ? DASHBOARD_SUBTITLE : undefined,
              subtitle
          )
        : subtitle
}
