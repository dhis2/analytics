import isString from 'd2-utilizr/lib/isString'
import getFilterText from '../../../../util/getFilterText'
import {
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_GAUGE,
} from '../../../modules/visTypes'
import getYearOverYearTitle from './yearOverYear'

const DEFAULT_TITLE_STYLE = {
    margin: 30,
    y: 18,
    style: {
        color: '#111',
    },
}

const DASHBOARD_TITLE_STYLE = {
    margin: 15,
    y: 12,
    style: {
        fontSize: '13px',
        fontWeight: 'bold',
    },
}

function getDefault(layout, metaData, dashboard) {
    // filters
    if (layout.filters && !dashboard) {
        return getFilterText(layout.filters, metaData)
    }

    return null
}

export default function(layout, metaData, dashboard) {
    const title = {
        text: undefined,
    }

    if (layout.hideTitle) {
        return title
    }

    if (isString(layout.title) && layout.title.length) {
        title.text = layout.title
    } else {
        switch (layout.type) {
            case VIS_TYPE_GAUGE:
            case VIS_TYPE_YEAR_OVER_YEAR_LINE:
            case VIS_TYPE_YEAR_OVER_YEAR_COLUMN:
                title.text = getYearOverYearTitle(layout, metaData, dashboard)
                break
            default:
                title.text = getDefault(layout, metaData, dashboard)
                break
        }
    }

    return Object.assign(
        {},
        DEFAULT_TITLE_STYLE,
        dashboard ? DASHBOARD_TITLE_STYLE : undefined,
        title
    )
}
