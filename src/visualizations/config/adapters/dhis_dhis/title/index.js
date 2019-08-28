import getFilterText from '../../dhis_highcharts/getFilterText'
import { VISUALIZATION_TYPE_SINGLE_VALUE } from '../type'
import getSingleValueTitle from './singleValue'

function getDefault(layout, metaData, dashboard) {
    return layout.filters && !dashboard
        ? getFilterText(layout.filters, metaData)
        : ''
}

export default function(layout, metaData, dashboard) {
    if (layout.hideTitle) {
        return ''
    }

    if (typeof layout.title === 'string' && layout.title.length) {
        return layout.title
    } else {
        let title
        switch (layout.type) {
            case VISUALIZATION_TYPE_SINGLE_VALUE:
                title = getSingleValueTitle(layout, metaData)

                break
            default:
                title = getDefault(layout, metaData, dashboard)
        }
        return title
    }
}
