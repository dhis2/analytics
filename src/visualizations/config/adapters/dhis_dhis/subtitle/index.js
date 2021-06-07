import { VIS_TYPE_SINGLE_VALUE } from '../../../../../modules/visTypes'
import getFilterText from '../../../../util/getFilterText'
import getSingleValueTitle from './singleValue'

function getDefault(layout, dashboard, metaData) {
    if (dashboard || typeof layout.title === 'string') {
        return getFilterText(layout.filters, metaData)
    }

    return ''
}

export default function (layout, metaData, dashboard) {
    if (layout.hideSubtitle) {
        return ''
    }

    if (typeof layout.subtitle === 'string' && layout.subtitle.length) {
        return layout.subtitle
    } else {
        let subtitle
        switch (layout.type) {
            case VIS_TYPE_SINGLE_VALUE:
                subtitle = getSingleValueTitle(layout, metaData)

                break
            default:
                subtitle = getDefault(layout, dashboard, metaData)
        }

        return subtitle
    }
}
