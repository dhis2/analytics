import isString from 'd2-utilizr/lib/isString'
import getFilterTitle from '../getFilterTitle'
import { VISUALIZATION_TYPE_SINGLE_VALUE } from '../type'
import getSingleValueTitle from './singleValue'

function getDefault(layout, metaData, dashboard) {
    // filters
    if (layout.filters && !dashboard) {
        return getFilterTitle(layout.filters, metaData)
    }

    return null
}

export default function(layout, metaData, dashboard) {
    let title = ''

    if (layout.hideTitle) {
        return title
    }

    if (isString(layout.title) && layout.title.length) {
        title = layout.title
    } else {
        switch (layout.type) {
            case VISUALIZATION_TYPE_SINGLE_VALUE:
                title = getSingleValueTitle(layout, metaData)

                break
            default:
                title = getDefault(layout, metaData, dashboard)
        }
    }

    return title
}
