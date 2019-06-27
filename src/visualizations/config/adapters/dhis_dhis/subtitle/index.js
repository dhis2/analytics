import isString from 'd2-utilizr/lib/isString'
import getFilterTitle from '../getFilterTitle'
import { VISUALIZATION_TYPE_SINGLE_VALUE } from '../type'
import getSingleValueTitle from './singleValue'

function getDefault(layout, dashboard, filterTitle) {
    return dashboard || isString(layout.title) ? filterTitle : ''
}

export default function(layout, metaData, dashboard) {
    let subtitle = ''

    if (layout.hideSubtitle) {
        return subtitle
    }

    if (isString(layout.subtitle) && layout.subtitle.length) {
        subtitle = layout.subtitle
    } else {
        switch (layout.type) {
            case VISUALIZATION_TYPE_SINGLE_VALUE:
                subtitle = getSingleValueTitle(
                    layout,
                    metaData,
                    dashboard,
                    false,
                    true
                )

                break
            default:
                const filterTitle = getFilterTitle(layout.filters, metaData)
                subtitle = getDefault(layout, dashboard, filterTitle)
        }
    }

    return subtitle
}
